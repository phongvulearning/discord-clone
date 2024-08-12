import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

export const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  [MemberRole.GUEST]: null,
};

export const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const DATE_FORMAT = "d MMM yyyy, h:mm";
