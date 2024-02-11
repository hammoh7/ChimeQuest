"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Lock, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.USER]: null,
  [MemberRole.MEDIATOR]: <ShieldCheck className="h-4 w-4 ml-2" />,
  [MemberRole.ADMIN]: <Lock className="h-4 w-4 ml-2" />,
};

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member.role];
  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversation/${member.id}`)
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-600/10 dark:hover:bg-zinc-600/60 transition mb-1",
        params?.memberId === member.id && "bg-slate-600/10 dark:bg-zinc-600"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-7 w-7 md:h-7 md:w-7"
      />
      <p
        className={cn(
          "font-semibold text-sm text-slate-600 group-hover:text-zinc-700 dark:text-zinc-300 dark:group-hover:text-zinc-200 transition",
          params?.memberId === member.id && "text-primary dark:text-zinc-300 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
