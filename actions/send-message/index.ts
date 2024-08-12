"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { currentProfile } from "@/lib/current-profile";
import { revalidatePath } from "next/cache";
import { SendMessageSchema } from "./schema";
import { io } from "socket.io-client";

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

    const channelKey = `chat:${channelId}:messages`;

    const path = "/api/socket";
    const SocketIO = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path,
      addTrailingSlash: false,
    });

    SocketIO.emit(channelKey, message);
  } catch (error) {
    return {
      error: "Failed to send message",
    };
  }

  revalidatePath(`/servers`);
  return { data: message };
};

export const sendMessage = createSafeAction(SendMessageSchema, handler);
