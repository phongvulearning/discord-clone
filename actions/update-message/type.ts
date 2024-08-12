import { z } from "zod";

import { Message } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateMessageSchema } from "./schema";

export type InputType = z.infer<typeof UpdateMessageSchema>;
export type OutputType = ActionState<InputType, Message>;
