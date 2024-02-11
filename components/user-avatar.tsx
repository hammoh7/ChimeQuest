import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
    src?: string,
    className?: string,
}

export const UserAvatar = ({
    src, className
}: UserAvatarProps) => {
    return (
        <Avatar className={cn("h-8 w-8 md:h-9 md:w-9",)}>
            <AvatarImage src={src} />
        </Avatar>
    )
}