import { profilePages } from "@/lib/curent-profile-pages";
import { database } from "@/lib/database";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await profilePages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "ServerId missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "ChannelId missing" });
    }
    const server = await database.server.findFirst({
        where: {
            id: serverId as string,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            members: true
        }
    })
    if(!server) {
        return res.status(404).json({ error: "Server not found" })
    }

    const channel = await database.channel.findFirst({
        where: {
          id: channelId as string,
          serverId: serverId as string,
        }
    })
    if(!channel) {
      return res.status(404).json({ error: "Channel not found" })
    }

    const member = server.members.find((member) => member.profileId === profile.id);
    if(!member) {
      return res.status(404).json({ error: "Member not found" })
    }

    let message = await database.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })
    if(!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" })
    }

    const isMesageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isMediator = member.role === MemberRole.MEDIATOR;

    const canModify = isMesageOwner || isAdmin || isMediator;
    if(!canModify) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if(req.method === "DELETE") {
      message = await database.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      })
    }
    
    if(req.method === "PATCH") {
      if (!isMesageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      message = await database.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      })
    }

    const updateKey = `chats:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal error" });
  }
}
