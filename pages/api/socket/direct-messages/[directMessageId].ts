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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "ConversationID missing" });
    }

    const conversation = await database.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id
            }
          },
          {
            memberTwo: {
              profileId: profile.id
            }
          },
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          }
        },
        memberTwo: {
          include: {
            profile: true,
          }
        }
      }
    })

    if(!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
    }

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;
    if(!member) {
      return res.status(404).json({ error: "Member not found" })
    }

    let directMessage = await database.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })
    if(!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" })
    }

    const isMesageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isMediator = member.role === MemberRole.MEDIATOR;

    const canModify = isMesageOwner || isAdmin || isMediator;
    if(!canModify) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if(req.method === "DELETE") {
      directMessage = await database.directMessage.update({
        where: {
          id: conversationId as string,
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
      directMessage = await database.directMessage.update({
        where: {
          id: conversationId as string,
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

    const updateKey = `chats:${conversation.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);
    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal error" });
  }
}
