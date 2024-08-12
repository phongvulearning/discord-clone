"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteServerSchema } from "./shema";
import { currentProfile } from "@/lib/current-profile";
import { revalidatePath } from "next/cache";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // Leave server
  const { serverId } = validatedData;

  if (!serverId) {
    return {
      error: "Server id is required",
    };
  }

  let server;

  try {
    server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });
  } catch (error) {
    return {
      error: "Failed to leave server",
    };
  }

  revalidatePath(`/servers`);
  return { data: server };
};

export const deleteServer = createSafeAction(DeleteServerSchema, handler);
