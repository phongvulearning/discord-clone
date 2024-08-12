import { z } from "zod";

import { Message } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { SendMessageFileSchema } from "./schema";

export type InputType = z.infer<typeof SendMessageFileSchema>;
export type OutputType = ActionState<InputType, Message>;
