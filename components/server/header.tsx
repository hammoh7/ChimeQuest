"use client";

import { ServerWithMembersProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  Plus,
  ServerCog,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersProfile;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isMediator = isAdmin || role === MemberRole.MEDIATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 py-3 flex items-center h-15 border-slate-200 dark:border-slate-900 border-b-2 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 text-sm font-medium text-black dark:text-slate-300 space-y-[3px]">
        {isMediator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="text-green-600 dark:text-green-300 p-auto text-sm cursor-pointer"
          >
            Create channel
            <Plus className="h-5 w-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMediator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-green-600 dark:text-green-300 p-auto text-sm cursor-pointer"
          >
            Invite people
            <UserPlus className="h-5 w-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMediator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="text-purple-600 dark:text-purple-300 p-auto text-sm cursor-pointer"
          >
            Server settings
            <ServerCog className="h-5 w-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="text-purple-600 dark:text-purple-300 p-auto text-sm cursor-pointer"
          >
            Manage members
            <Users className="h-5 w-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMediator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="text-rose-600 dark:text-rose-300 p-auto text-sm cursor-pointer"
          >
            Delete Server
            <Trash2 className="h-5 w-5 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="text-rose-600 dark:text-rose-300 p-auto text-sm cursor-pointer"
          >
            Leave Server
            <LogOut className="h-5 w-5 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
