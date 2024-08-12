import { z } from "zod";

import { Server } from "@prisma/client";

import { UpdateChannelSchema } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateChannelSchema>;
export type OutputType = ActionState<InputType, Server>;
