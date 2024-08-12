import { z } from "zod";

export const SendMessageSchema = z.object({
  serverId: z.string(),
  channelId: z.string(),
  content: z.string().min(1),
});
