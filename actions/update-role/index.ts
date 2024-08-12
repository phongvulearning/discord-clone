"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateRoleSchema } from "./shema";
import { currentProfile } from "@/lib/current-profile";
import { revalidatePath } from "next/cache";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // Update role
  const { role, serverId, memberId } = validatedData;

  if (!serverId) {
    return {
      error: "Server id is required",
    };
  }

  if (!memberId) {
    return {
      error: "Member id is required",
    };
  }

  if (!role) {
    return { error: "Role is required" };
  }

  let server;

  try {
    server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
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
            role: "asc",
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to update role",
    };
  }

  revalidatePath(`/servers`);
  return { data: server };
};

export const updateRole = createSafeAction(UpdateRoleSchema, handler);
