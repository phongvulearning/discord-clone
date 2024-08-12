import { z } from "zod";

import { Server } from "@prisma/client";

import { UpdateRoleSchema } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateRoleSchema>;
export type OutputType = ActionState<InputType, Server>;
