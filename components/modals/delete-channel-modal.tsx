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
import { deleteChannel } from "@/actions/delete-channel";
import { toast } from "sonner";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { execute, isLoading } = useAction(deleteChannel, {
    onError() {
      toast.error("Failed to delete channel");
    },
    onSuccess() {
      toast.success("Channel deleted successfully");
      onClose();
    },
  });

  const { channel, server } = data;

  const isModalOpen = isOpen && type === "deleteChannel";

  const onConfirm = useCallback(() => {
    if (channel && server) {
      execute({ serverId: server?.id, channelId: channel?.id });
    }
  }, [channel, server, execute]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="">
            Are you sure want to do this?{" "}
            <span className="font-semibold text-indigo-500">
              #{channel?.name}
            </span>{" "}
            will be permanently deleted.
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
