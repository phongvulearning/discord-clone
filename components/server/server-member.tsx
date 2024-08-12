"use client";
import { roleIconMap } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Member, Profile, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { UserAvatar } from "../user-avatar";

type ServerMemberProps = {
  member: Member & { profile: Profile };
  server: Server;
};

export const ServerMember = ({ server, member }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const Icon = roleIconMap[member?.role];

  const onClick = () => {
    router.push(`/servers/${server?.id}/conversations/${member?.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member?.id && "bg-zin-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar src={member?.profile?.imageUrl} className="w-8 h-8" />
      <p
        className={cn(
          "font-semibold text-start text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === member?.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member?.profile?.name}
      </p>
      {Icon}
    </button>
  );
};
