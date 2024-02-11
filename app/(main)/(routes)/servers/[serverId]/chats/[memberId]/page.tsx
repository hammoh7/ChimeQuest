import { ChatHeader } from "@/components/chats/header";
import { ChatInput } from "@/components/chats/input";
import { ChatMessage } from "@/components/chats/messages";
import { Conversations } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { database } from "@/lib/database";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberId = async ({ params }: MemberIdProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const currentMember = await database.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if(!currentMember) {
    return redirect("/");
  }
  const conversation = await Conversations(currentMember.id, params.memberId);
  if(!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-zinc-700 flex flex-col h-full">
        <ChatHeader 
            imageUrl={otherMember.profile.imageUrl}
            name={otherMember.profile.name}
            serverId={params.serverId}
            type="conversation"
        />
        <ChatMessage
          member={currentMember}
          name={otherMember.profile.name}
          chatId={conversation.id}
          type="conversation"
          apiUrl="/api/direct-messages"
          paramKey="conversationId"
          paramValue={conversation.id}
          socketUrl="/api/socket/direct-messages"
          socketQuery={{
            conversationId: conversation.id,
          }}
        />
        <ChatInput
          name={otherMember.profile.name}
          type="conversation"
          apiUrl="/api/socket/direct-messages"
          query={{
            conversationId: conversation.id,
          }}
        />
    </div>
  )
};

export default MemberId;
