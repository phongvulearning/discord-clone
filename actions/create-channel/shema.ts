import { ChannelType } from "@prisma/client";
import { z } from "zod";

export const CreateChannelSchema = z.object({
  serverId: z.string().optional(),
  name: z
    .string({
      required_error: "Channel name is required",
      invalid_type_error: "Channel name must be a string",
    })
    .min(3, { message: "Channel name must be at least 3 characters" })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});
