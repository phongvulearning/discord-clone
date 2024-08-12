import { z } from "zod";

export const DeleteServerSchema = z.object({
  serverId: z.string(),
});
