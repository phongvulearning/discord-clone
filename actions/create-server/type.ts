import { z } from "zod";

import { Server } from "@prisma/client";

import { CreateServerSchema } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof CreateServerSchema>;
export type OutputType = ActionState<InputType, Server>;
