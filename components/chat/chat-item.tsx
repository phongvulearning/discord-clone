"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { roleIconMap } from "@/lib/const";
import Image from "next/image";
import { Edit, FileIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { SendMessageSchema } from "@/actions/send-message/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { updateMessage } from "@/actions/update-message";
import { UpdateMessageSchema } from "@/actions/update-message/schema";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";

interface ChatItemProps {
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

export const ChatItem = ({
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
}: ChatItemProps) => {
  const router = useRouter();
  const params = useParams();

  const { onOpen } = useModal();
  const [isEditting, setIsEditting] = useState(false);

  const { serverId, channelId } = socketQuery;

  const { execute, isLoading } = useAction(updateMessage, {
    onSuccess(data) {
      form.reset();
      setIsEditting(false);
      toast.success("Message updated successfully");
    },
    onError(error) {
      toast.error(error);
      setIsEditting(false);
      toast.error("Failed to updated message");
    },
  });

  const form = useForm<z.infer<typeof UpdateMessageSchema>>({
    resolver: zodResolver(UpdateMessageSchema),
    defaultValues: {
      content: "",
      serverId,
      channelId,
      messageId: id,
    },
  });

  useEffect(() => {
    form.reset({
      content,
      messageId: id,
      serverId,
      channelId,
    });
  }, [channelId, content, form, id, serverId]);

  const fileType = fileUrl?.split(".").pop();
  const isOwner = currentMember?.id === member?.id;
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;

  const canEditMessage = !deleted && isOwner && !fileUrl;
  const canDeleteMessage = !deleted && (isOwner || isAdmin || isModerator);

  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const onMemberClick = () => {
    if (isOwner) return;

    router.push(`/servers/${serverId}/conversations/${member?.id}`);
  };

  const onSubmit = (data: z.infer<typeof UpdateMessageSchema>) => {
    execute({
      ...data,
      type: "update",
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditting(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-4 relative group flex items-center hover:bg-black/5 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar className="" src={member?.profile?.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer mr-2">
                {member?.profile?.name}
              </p>
              <ActionTooltip label={member?.role}>
                {roleIconMap[member?.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditting && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-indigo-100 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditting && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full pt-2 gap-x-2"
              >
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Please escape to cancel | enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                className="w-4 h-4 ml-auto cursor-pointer text-zinc-500  hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditting(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="w-4 h-4 ml-auto cursor-pointer text-zinc-500  hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              onClick={() =>
                onOpen("deleteMessage", {
                  query: {
                    serverId,
                    channelId,
                    messageId: id,
                  },
                })
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
