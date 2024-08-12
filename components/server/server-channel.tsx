"use client";

import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/const";
import { useParams, useRouter } from "next/navigation";
import { Edit, Lock, Trash } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { Channel, MemberRole, Server } from "@prisma/client";

interface ServerChannelProps {
  channel: Channel;
  role?: MemberRole;
  server: Server;
}

export const ServerChannel = ({
  channel,
  role,
  server,
}: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();

  const Icon = iconMap[channel?.type];

  const onClick = () => {
    router.push(`/servers/${server?.id}/channels/${channel?.id}`);
  };

  const onAction = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    type: ModalType
  ) => {
    e.stopPropagation();
    onOpen(type, { server, channel });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center justify-start gap-x-2 w-full hover:bg-zin-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel?.id && "bg-zin-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 text-start font-semibold text-sm  text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel?.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel?.name}
      </p>
      {channel?.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel?.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500" />
      )}
    </button>
  );
};
