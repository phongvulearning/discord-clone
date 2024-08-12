"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateServerSchema } from "./shema";
import { currentProfile } from "@/lib/current-profile";
import { revalidatePath } from "next/cache";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // Update a server
  const { name, imageUrl, serverId } = validatedData;

  if (!name || !imageUrl) {
    return {
      error: "Invalid data. Failed to create server",
    };
  }

  let server;

  try {
    server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        name,
        imageUrl,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update server",
    };
  }

  revalidatePath(`/servers/${server.id}`);
  return { data: server };
};

export const updateServer = createSafeAction(UpdateServerSchema, handler);
