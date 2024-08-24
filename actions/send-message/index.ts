"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { currentProfile } from "@/lib/current-profile";
import { revalidatePath } from "next/cache";
import { SendMessageSchema } from "./schema";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // update channel
  const { serverId, channelId, content } = validatedData;

  if (!serverId) {
    return {
      error: "Server ID is missing",
    };
  }

  if (!channelId) {
    return {
      error: "Channel ID is missing",
    };
  }

  if (!content) {
    return {
      error: "Content is missing",
    };
  }

  let message;

  try {
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return {
        error: "Server not found",
      };
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: server.id,
      },
    });

    if (!channel) {
      return {
        error: "Channel not found",
      };
    }

    const member = server?.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return {
        error: "Member not found",
      };
    }

    message = await db.message.create({
      data: {
        content,
        channelId: channel.id,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to send message",
    };
  }

  return { data: message };
};

export const sendMessage = createSafeAction(SendMessageSchema, handler);
