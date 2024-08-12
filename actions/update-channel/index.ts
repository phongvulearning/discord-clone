"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateChannelSchema } from "./shema";
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

  // update channel
  const { serverId, channelId, name, type } = validatedData;

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

  if (!type) {
    return {
      error: "Channel type is required",
    };
  }

  if (name === "general") {
    return {
      error: "Channel name can't be general",
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
          update: {
            where: {
              id: channelId,
              name: {
                not: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to update channel",
    };
  }

  revalidatePath(`/servers`);

  return { data: server };
};

export const updateChannel = createSafeAction(UpdateChannelSchema, handler);
