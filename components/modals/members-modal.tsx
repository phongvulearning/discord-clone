"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useAction } from "@/hooks/use-action";
import { ServerWithMembersWthProfile } from "@/type";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { MemberRole } from "@prisma/client";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { updateRole } from "@/actions/update-role";
import { deleteMember } from "@/actions/delete-member";
import { roleIconMap } from "@/lib/const";
import { toast } from "sonner";

export const MembersModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const { execute: changeRole } = useAction(updateRole, {
    onError() {
      toast.error("Failed to update role");
    },
    onSuccess(data) {
      setLoadingId("");
      toast.success("Role updated successfully");
      onOpen("members", { server: data });
    },
  });
  const { execute: kickMember } = useAction(deleteMember, {
    onError() {
      toast.error("Failed to kick member");
    },
    onSuccess(data) {
      toast.success("Member kicked successfully");
      setLoadingId("");
      onOpen("members", { server: data });
    },
  });

  const [loadingId, setLoadingId] = useState("");
  const { server } = data as { server: ServerWithMembersWthProfile };

  const isModalOpen = isOpen && type === "members";

  const onChangeRole = useCallback(
    (memberId: string, role: MemberRole) => {
      setLoadingId(memberId);
      changeRole({ serverId: server?.id, memberId, role });
    },
    [changeRole, server?.id]
  );

  const onKick = useCallback(
    (memberId: string) => {
      setLoadingId(memberId);
      kickMember({ serverId: server?.id, memberId });
    },
    [server?.id, kickMember]
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black py-0 px-6">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member?.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member?.profile?.imageUrl} />
              <div className="fle flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-2">
                  {member?.profile?.name}
                  {roleIconMap[member?.role]}
                </div>
                <p className="text-xs text-zinc-500">
                  {member?.profile?.email}
                </p>
              </div>
              {server?.profileId !== member?.profileId &&
                loadingId !== member?.id && (
                  <div className="ml-auto pr-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="h-4 w-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onChangeRole(member?.id, MemberRole.GUEST)
                                }
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member?.role === MemberRole.GUEST && (
                                  <Check className="h-4 w-4 ml-2" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onChangeRole(member?.id, MemberRole.MODERATOR)
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member?.role === MemberRole.MODERATOR && (
                                  <Check className="h-4 w-4 ml-2" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member?.id)}>
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member?.id && (
                <Loader2 className="text-zinc-500 animate-spin ml-auto h-4 w-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
