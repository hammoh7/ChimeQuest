"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./home";
import { useChatQuery } from "@/hooks/chat-query";
import { Loader, XCircle } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import { ChatContent } from "./content";
import { format } from "date-fns";
import { ChatSocket } from "@/hooks/chat-socket";
import { ChatScroll } from "@/hooks/chat-scroll";

const DATE_FORMAT = "dd/MM/yyyy, hh:mm";

type MessageMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessageProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessage = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessageProps) => {
  const queryKey = `chats:${chatId}`;
  const addKey = `chats:${chatId}:messages`;
  const updateKey = `chats:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  ChatSocket({ queryKey, addKey, updateKey });
  ChatScroll({
    chatRef, 
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0
  })

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader className="h-6 w-6 text-zinc-400 animate-spin my-3" />
        <p className="text-sm text-slate-400/80 dark:text-slate-300/80">
          Loading...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <XCircle className="h-6 w-6 text-zinc-400 my-3" />
        <p className="text-sm text-slate-400/80 dark:text-slate-300/80">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader className="h-5 w-5 text-slate-500 animate-spin" />
          ) : (
            <button onClick={() => fetchNextPage()} className="text-slate-500 hover:text-zinc-700 dark:text-slate-300 text-xs my-4 dark:hover:text-zinc-300 transition">
              Loading previous message
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageMemberWithProfile) => (
              <ChatContent
                key={message.id}
                id={message.id}
                member={message.member}
                currentMember={member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
