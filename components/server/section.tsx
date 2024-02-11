"use client";

import { ServerWithMembersProfile } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings2 } from "lucide-react";
import { useModal } from "@/hooks/modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersProfile;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </p>
      {role !== MemberRole.USER && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-slate-700 hover:text-black dark:text-slate-300 dark:hover:text-white transition"
          >
            <Plus className="h-4 w-4 " />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-slate-700 hover:text-black dark:text-slate-300 dark:hover:text-white transition"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
