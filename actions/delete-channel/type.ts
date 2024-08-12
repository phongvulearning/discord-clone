import { z } from "zod";

import { Server } from "@prisma/client";

import { DeleteChannelSchema } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof DeleteChannelSchema>;
export type OutputType = ActionState<InputType, Server>;
