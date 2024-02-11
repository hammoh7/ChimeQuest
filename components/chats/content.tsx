"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import {
  Edit,
  FileIcon,
  ShieldAlert,
  ShieldCheck,
  Trash,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/modal-store";
import { useRouter, useParams } from "next/navigation"; 

interface ChatContentProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  USER: null,
  MEDIATOR: <ShieldCheck className="h-3 w-3 ml-3 text-yellow-200" />,
  ADMIN: <ShieldAlert className="h-3 w-3 ml-3 text-emerald-300" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatContent = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatContentProps) => {
  const fileType = fileUrl?.split(".").pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isMediator = currentMember.role === MemberRole.MEDIATOR;
  const isOwner = currentMember.id === member.id;
  const canDeletemessage = !deleted && (isAdmin || isMediator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const [isEdit, setIsEdit] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Esc" || event.keyCode === 27) {
        setIsEdit(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);

  return (
    <div className="relative group flex items-center hover:bg-slate-900/10 p-3 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="font-semibold text-xs cursor-pointer mb-1 text-zinc-600 dark:text-zinc-300">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-slate-400 ml-auto mr-5 mt-4">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-w-1 aspect-h-1 aspect-square rounded-lg mt-2 overflow-hidden border flex items-center bg-secondary"
            >
              <Image
                src={fileUrl}
                alt={content}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-lg bg-background/20">
              <FileIcon className="h-10 w-10 fill-purple-300 stroke-purple-500" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-md text-purple-400 dark:text-purple-400 hover:underline"
              >
                PDF file
              </a>
            </div>
          )}
          {!fileUrl && !isEdit && (
            <p
              className={cn(
                "text-sm text-slate-800 dark:text-slate-100",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-200 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[12px] mx-2 text-slate-400/20">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEdit && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-slate-300/70 dark:bg-slate-600/80 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-neutral-600 dark:text-neutral-300"
                            placeholder="Your edited message here..."
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="outline">
                  Update
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
      {canDeletemessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-10 bg-white dark:bg-zinc-700/10 border rounded-md">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEdit(true)}
                className="h-4 w-4 cursor-pointer ml-auto text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="h-4 w-4 cursor-pointer ml-auto text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
