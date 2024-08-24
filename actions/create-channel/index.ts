"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateChannelSchema } from "./shema";
import { revalidatePath } from "next/cache";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@/prisma/generated/client";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // Create a channel
  const { name, type, serverId } = validatedData;

  if (!name || !type || !serverId) {
    return {
      error: "Invalid data. Failed to create channel",
    };
  }

  if (name === "general") {
    return {
      error: "Channel name cannot be 'general'",
    };
  }

  let channel;

  try {
    channel = await db.server.update({
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
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to create channel",
    };
  }

  revalidatePath("/servers");
  return { data: channel };
};

export const createChannel = createSafeAction(CreateChannelSchema, handler);
