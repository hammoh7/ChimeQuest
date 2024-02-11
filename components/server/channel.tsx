"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Text, Mic, Video, Edit2, Trash2, LockIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Text,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();
  const Icon = iconMap[channel.type];
  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-600/10 dark:hover:bg-zinc-700/50 transition mb-0.5",
        params?.channelId === channel.id && "bg-zinc-600/40 dark:bg-zinc-600"
      )}
    >
      <Icon className="flex-shrink-0 w-4 h-4 text-slate-700 dark:text-zinc-500" />
      <p
        className={cn(
          "line-clamp-3 font-semibold text-sm text-zinc-800 group-hover:text-stone-600 dark:text-zinc-300 dark:group-hover:text-slate-100",
          params?.channelId === channel.id &&
            "text-primary dark:text-slate-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.USER && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit2 onClick={(e) => onAction(e, "editChannel")} className="w-4 h-4 hidden group-hover:block text-slate-500 hover:text-zinc-600 dark:text-slate-400 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash2 onClick={(e) => onAction(e, "deleteChannel")} className="w-4 h-4 hidden group-hover:block text-slate-500 hover:text-zinc-600 dark:text-slate-400 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <LockIcon className="ml-auto w-4 h-4 text-slate-600 dark:text-zinc-400" />
      )}
    </button>
  );
};
