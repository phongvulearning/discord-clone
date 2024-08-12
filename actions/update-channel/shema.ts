import { ChannelType } from "@prisma/client";
import { z } from "zod";

export const UpdateChannelSchema = z.object({
  serverId: z.string(),
  channelId: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Channel name is required",
    })
    .refine((name) => name !== "general", {
      message: "Channel name can't be general",
    }),
  type: z.nativeEnum(ChannelType),
});
