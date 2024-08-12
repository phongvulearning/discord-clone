"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { CheckIcon, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { useAction } from "@/hooks/use-action";
import { refreshInviteCodeServer } from "@/actions/refresh-invite-code-server";
import { toast } from "sonner";

export const InviteModal = () => {
  const origin = useOrigin();

  const { isOpen, onClose, type, data, onOpen } = useModal();
  const { execute, isLoading } = useAction(refreshInviteCodeServer, {
    onError() {
      toast.error("Failed to refresh invite link");
    },
    onSuccess(data) {
      toast.success("Invite link refreshed successfully");
      onOpen("invite", { server: data });
    },
  });

  const [copied, setCopied] = useState(false);

  const { server } = data;
  const isModalOpen = isOpen && type === "invite";

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      toast.success("Invite link copied successfully");
    }, 1000);
  };

  const onNewLink = () => {
    if (server?.id) {
      execute({
        serverId: server?.id,
      });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-50 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button size="icon" onClick={onCopy}>
              {copied ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNewLink}
            className="text-xs text-zinc-500 mt-4"
            variant="link"
            size="sm"
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCcw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
