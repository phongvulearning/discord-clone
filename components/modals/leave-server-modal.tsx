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
import { leaveServer } from "@/actions/leave-server";
import { toast } from "sonner";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { execute, isLoading } = useAction(leaveServer, {
    onError() {
      toast.error("Failed to leave server");
    },
    onSuccess() {
      toast.success("Server left successfully");
      onClose();
    },
  });

  const { server } = data;
  const serverId = (server?.id || "") as string;

  const isModalOpen = isOpen && type === "leaveServer";

  const onConfirm = useCallback(() => {
    execute({ serverId });
  }, [execute, serverId]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{" "}
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              disabled={isLoading}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
