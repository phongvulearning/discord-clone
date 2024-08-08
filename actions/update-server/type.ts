import { z } from "zod";

import { UpdateServerSchema } from "./shema";
import { ActionState } from "@/lib/create-safe-action";
import { Server } from "@prisma/client";

export type InputType = z.infer<typeof UpdateServerSchema>;
export type OutputType = ActionState<InputType, Server>;
