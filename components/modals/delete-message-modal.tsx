"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useCallback } from "react";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { updateMessage } from "@/actions/update-message";

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { execute, isLoading } = useAction(updateMessage, {
    onError(error) {
      console.log(error);
      toast.error("Failed to delete message");
    },
    onSuccess() {
      toast.success("Message deleted successfully");
      onClose();
    },
  });

  const { query } = data;

  const serverId = query?.serverId as string;
  const channelId = query?.channelId as string;
  const messageId = query?.messageId as string;

  const isModalOpen = isOpen && type === "deleteMessage";

  const onConfirm = useCallback(() => {
    if (!serverId || !channelId || !messageId) {
      toast.error("Missing Ids");
      return;
    }

    execute({
      serverId,
      channelId,
      messageId,
      type: "delete",
      content: "cheat",
    });
  }, [channelId, execute, messageId, serverId]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="">
            Are you sure want to do this? The message will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={isLoading} onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
