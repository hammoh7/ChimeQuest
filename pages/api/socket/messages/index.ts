import { NextApiRequest } from "next";
import { profilePages } from "@/lib/curent-profile-pages";
import { database } from "@/lib/database";
import { NextApiResponseServerIo } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await profilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "ServerID missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "ChannelID missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const server = await database.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await database.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return res.status(404).json({ messaage: "Member not found" });
    }

    const message = await database.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chats:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_POST]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
