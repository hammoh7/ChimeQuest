import { MenuSquare, Text } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";

interface ChannelHeaderProps {
    serverId: string,
    name: string,
    type: "channel" | "conversation"
    imageUrl?: string
}

export const ChatHeader = ({
    serverId, name, type, imageUrl
}: ChannelHeaderProps) => {
    return (
        <div className="text-md font-semibold px-5 flex items-center h-[49.5px] border-slate-300 dark:border-slate-800 border-b-2">
            <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <Text className="w-4 h-4 text-slate-500 dark:text-slate-300 ml-4 mr-2" />
            )}
            {type ==="conversation" && (
                <UserAvatar
                src={imageUrl}
                className="h-6 w-6 md:h-6 md:w-6mr-3"
                />
            )}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                <SocketIndicator />
            </div>
        </div>
    )
}