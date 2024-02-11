import { useSocket } from "@/components/providersUI/socket-provider"; 
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string,
    updateKey: string,
    queryKey: string,
}

type MessageWithMembersProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

export const ChatSocket = ({
    addKey,
    updateKey,
    queryKey,
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on(updateKey, (message: MessageWithMembersProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMembersProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        })
                    }
                });
                return {
                    ...oldData,
                    pages: newData,
                }
            })
        });
        socket.on(addKey, (message: MessageWithMembersProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message],
                        }]
                    }
                }
                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items,
                    ]
                };

                return {
                    ...oldData,
                    pages: newData,
                }
            })
        })
        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [queryClient, addKey, updateKey, queryKey, socket])
}