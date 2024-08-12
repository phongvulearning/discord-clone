import { z } from "zod";

export const LeaveServerSchema = z.object({
  serverId: z.string(),
});
