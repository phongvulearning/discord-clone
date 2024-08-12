import { z } from "zod";

export const RefreshInviteCodeServerSchema = z.object({
  serverId: z.string(),
});
