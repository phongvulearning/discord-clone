import { z } from "zod";

import { Server } from "@prisma/client";

import { DeleteServerSchema } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof DeleteServerSchema>;
export type OutputType = ActionState<InputType, Server>;
