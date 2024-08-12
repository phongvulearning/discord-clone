import { z } from "zod";

import { Message } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { SendMessageSchema } from "./schema";

export type InputType = z.infer<typeof SendMessageSchema>;
export type OutputType = ActionState<InputType, Message>;
