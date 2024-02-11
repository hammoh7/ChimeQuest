"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/modal-store";

export const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button onClick={() => onOpen("createServer")} className="group flex items-center">
          <div className="flex mx-3 h-[40px] w-[40px] rounded-2xl group-hover:rounded-[20px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-slate-600 group-hover:bg-indigo-300">
            <Plus
              className="group-hover:text-white transition text-indigo-300 mx-auto"
              size={30}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
