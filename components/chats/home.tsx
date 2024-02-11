import { Text } from "lucide-react"

interface ChatWelcomeProps {
    name: string,
    type: "channel" | "conversation",
}

export const ChatWelcome = ({
    name, type
}: ChatWelcomeProps) => {
    return (
        <div className="space-y-2 pl-5 mb-5">
            {type === "channel" && (
                <div className="h-[50px] w-[50px] rounded-full bg-slate-500 dark:bg-neutral-700 items-center justify-center">
                    <Text className="h-9 w-9 text-white pl-3 pt-3" />
                </div>
            )}
            <p className="text-xl md:text-2xl font-bold">
                {type === "channel" ? "Welcome to " : ""}{name}
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                {type === "channel"
                    ? `This is start of ${name} channel`
                    : `This is start of your conversation with ${name}`
                }

            </p>
        </div>
    )
}