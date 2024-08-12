import { z } from "zod";

import { RefreshInviteCodeServerSchema } from "./shema";
import { ActionState } from "@/lib/create-safe-action";
import { Server } from "@prisma/client";

export type InputType = z.infer<typeof RefreshInviteCodeServerSchema>;
export type OutputType = ActionState<InputType, Server>;
