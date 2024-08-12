"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteChannelSchema } from "./shema";
import { currentProfile } from "@/lib/current-profile";
import { revalidatePath } from "next/cache";
import { MemberRole } from "@prisma/client";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // Delete server
  const { serverId, channelId } = validatedData;

  if (!serverId) {
    return {
      error: "Server id is required",
    };
  }

  if (!channelId) {
    return {
      error: "Channel id is required",
    };
  }

  let server;

  try {
    server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete channel",
    };
  }

  revalidatePath(`/servers`);

  return { data: server };
};

export const deleteChannel = createSafeAction(DeleteChannelSchema, handler);
