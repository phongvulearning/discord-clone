import { z } from "zod";

import { Server } from "@prisma/client";

import { UpdateServerSchema } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateServerSchema>;
export type OutputType = ActionState<InputType, Server>;
