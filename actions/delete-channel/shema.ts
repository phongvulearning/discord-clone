import { z } from "zod";

export const DeleteChannelSchema = z.object({
  serverId: z.string(),
  channelId: z.string(),
});
