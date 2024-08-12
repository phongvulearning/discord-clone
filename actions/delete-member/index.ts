"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteServerSchema } from "./shema";
import { currentProfile } from "@/lib/current-profile";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // Delete member
  const { memberId, serverId } = validatedData;

  if (!memberId || !serverId) {
    return {
      error: "Invalid data. Failed to delete member",
    };
  }

  let server;

  try {
    server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete member",
    };
  }

  return { data: server };
};

export const deleteMember = createSafeAction(DeleteServerSchema, handler);
