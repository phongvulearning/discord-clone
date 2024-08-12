import { MemberRole } from "@prisma/client";
import { z } from "zod";

export const UpdateRoleSchema = z.object({
  serverId: z.string(),
  memberId: z.string(),
  role: z.nativeEnum(MemberRole),
});
