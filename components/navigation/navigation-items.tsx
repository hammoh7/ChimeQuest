"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";

interface NavigationItemsProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItems = ({
  id,
  imageUrl,
  name,
}: NavigationItemsProps) => {
  const params = useParams();
  const router = useRouter();
  const onClick =() => {
    router.push(`/servers/${id}`);
  }
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[3px]",
            params?.serverId !== id && "group-hover:h-[25px]",
            params?.serverId === id ? "h-[30px]" : "h-[10px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[40px] w-[40px] rounded-lg group-hover:rounded-[20px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[20px]"
          )}
        >
            <Image 
                fill
                src={imageUrl}
                alt="server"
            />
        </div>
      </button>
    </ActionTooltip>
  );
};
