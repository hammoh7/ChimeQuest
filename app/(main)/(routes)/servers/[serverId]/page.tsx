import { currentProfile } from "@/lib/current-profile";
import { database } from "@/lib/database";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdProps {
  params: {
    serverId: string;
  };
}

const ServerId = async ({ params }: ServerIdProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const server = await database.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  const firstChannel = server?.channels[0];

  if (firstChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${firstChannel?.id}`);
};

export default ServerId;
