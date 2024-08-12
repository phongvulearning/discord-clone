import { z } from "zod";

export const SendMessageFileSchema = z.object({
  serverId: z.string().optional(),
  channelId: z.string().optional(),
  fileUrl: z.string().optional(),
  content: z.string().optional(),
});
