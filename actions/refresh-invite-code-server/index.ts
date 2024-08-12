"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { RefreshInviteCodeServerSchema } from "./shema";
import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // Create a server
  const { serverId } = validatedData;

  if (!serverId) {
    return {
      error: "Invalid data. Failed to update server",
    };
  }

  let server;

  try {
    server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        inviteCode: uuidv4(),
      },
    });
  } catch (error) {
    return {
      error: "Failed to update server",
    };
  }

  return { data: server };
};

export const refreshInviteCodeServer = createSafeAction(
  RefreshInviteCodeServerSchema,
  handler
);
