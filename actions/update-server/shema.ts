import { z } from "zod";

export const UpdateServerSchema = z.object({
  serverId: z.string(),
  name: z
    .string({
      required_error: "Server name is required",
      invalid_type_error: "Server name must be a string",
    })
    .min(3, { message: "Server name must be at least 3 characters" }),
  imageUrl: z
    .string({
      required_error: "Image is required",
      invalid_type_error: "Image is required",
    })
    .min(1, { message: "Image  is required" }),
});
