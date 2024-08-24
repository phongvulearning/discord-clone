"use client";

import { z } from "zod";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus, Smile } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { sendMessage } from "@/actions/send-message";
import { SendMessageSchema } from "@/actions/send-message/schema";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "../emoji-picker";

interface ChatInputProps {
  name: string;
  type: "conversation" | "channel";
  query: Record<string, any>;
}

export const ChatInput = ({ query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const { serverId, channelId } = query;

  const { execute, isLoading } = useAction(sendMessage, {
    onSuccess: async (data) => {
      form.reset();
    },
    onError() {
      form.reset();
      toast.error("Failed to send message");
    },
  });

  const form = useForm<z.infer<typeof SendMessageSchema>>({
    resolver: zodResolver(SendMessageSchema),
    defaultValues: {
      content: "",
      serverId,
      channelId,
    },
  });

  const onSubmit = async (data: z.infer<typeof SendMessageSchema>) => {
    execute({
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-full p-1 flex items-center justify-center"
                    type="button"
                    disabled={isLoading}
                    onClick={() => onOpen("messageFile", { query })}
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
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
