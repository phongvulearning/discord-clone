"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateServerSchema } from "./shema";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { currentProfile } from "@/lib/current-profile";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // Create a server
  const { name, imageUrl } = validatedData;

  if (!name || !imageUrl) {
    return {
      error: "Invalid data. Failed to create server",
    };
  }

  let server;

  try {
    server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.MODERATOR }],
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to create server",
    };
  }

  revalidatePath("/servers");
  return { data: server };
};

export const createServer = createSafeAction(CreateServerSchema, handler);
