import { z } from "zod";

export const UpdateServerSchema = z.object({
  serverId: z.string(),
});
