"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { FileUpload } from "@/components/file-upload";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal-store";
import { sendMessageFile } from "@/actions/send-message-file";
import { SendMessageFileSchema } from "@/actions/send-message-file/schema";

export const MessageFileModal = () => {
  const { isOpen, onOpen, onClose, data, type } = useModal();

  const { query } = data;
  const serverId = query?.serverId as string;
  const channelId = query?.channelId as string;

  const isModalOpen =
    isOpen && type === "messageFile" && !!serverId && !!channelId;

  const { execute, isLoading } = useAction(sendMessageFile, {
    onError() {
      toast.error("Failed to send message file");
    },
    onSuccess() {
      form.reset();
      handleClose();
    },
  });

  const form = useForm<z.infer<typeof SendMessageFileSchema>>({
    resolver: zodResolver(SendMessageFileSchema),
    defaultValues: {
      fileUrl: "",
      serverId,
      channelId,
      content: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof SendMessageFileSchema>) => {
      execute({
        ...values,
        content: values.fileUrl,
        serverId,
        channelId,
      });
    },
    [channelId, execute, serverId]
  );

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message to your channel
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() =>
              onSubmit({ ...form.getValues(), serverId, channelId })
            )}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <div className=" flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          onChange={field.onChange}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                variant="primary"
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
