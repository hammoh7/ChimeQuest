"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/modal-store";
import { EmojiPicker } from "../emoji";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type, }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-5 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageAttach", { apiUrl, query })}
                    className="absolute top-7 left-7 h-[25px] bg-slate-500 dark:bg-neutral-400 hover:bg-zinc-700 dark:hover:bg-zinc-400 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-slate-900" />
                  </button>
                  <Input
                    disabled={isLoading}
                    placeholder="Type your message here"
                    className="pl-14 py-5 bg-zinc-300 dark:bg-neutral-200/25 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-800 dark:text-slate-200 "
                    {...field}
                  />
                  <div className="absolute top-7 right-7">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
