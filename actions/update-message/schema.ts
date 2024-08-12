import { z } from "zod";

export const UpdateMessageSchema = z.object({
  messageId: z.string().optional(),
  serverId: z.string().optional(),
  channelId: z.string().optional(),
  content: z.string().min(1),
  type: z.enum(["update", "delete"]).default("update").optional(),
});
