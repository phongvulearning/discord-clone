import { z } from "zod";

export const DeleteServerSchema = z.object({
  serverId: z.string(),
  memberId: z.string(),
});
