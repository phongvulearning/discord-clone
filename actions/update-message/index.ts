"use server";

import { db } from "@/lib/db";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { currentProfile } from "@/lib/current-profile";
import { revalidatePath } from "next/cache";
import { UpdateMessageSchema } from "./schema";
import { io } from "socket.io-client";
import { MemberRole } from "@prisma/client";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const profile = await currentProfile();

  if (!profile) {
    return {
      error: "Unauthorized",
    };
  }

  // update channel
  const { serverId, channelId, content, messageId, type } = validatedData;

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

  if (!messageId) {
    return {
      error: "Message ID is missing",
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
    message = await db.message.findFirst({
      where: {
        id: messageId,
        channelId: channel.id,
      },
      include: {
        member: {
          include: { profile: true },
        },
      },
    });
    if (!message || message.deleted) {
      return {
        error: "Message not found",
      };
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member?.role === MemberRole.ADMIN;
    const isModerator = member?.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return {
        error: "You don't have permission to modify this message",
      };
    }

    if (type === "delete") {
      message = await db.message.update({
        where: {
          id: messageId,
          channelId: channel.id,
        },
        data: {
          deleted: true,
          fileUrl: null,
          content: "This message has been deleted.",
        },
        include: {
          member: {
            include: { profile: true },
          },
        },
      });
    }

    if (type === "update") {
      if (!isMessageOwner) {
        return {
          error: "You don't have permission to modify this message",
        };
      }

      message = await db.message.update({
        where: {
          id: messageId,
          channelId: channel.id,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: { profile: true },
          },
        },
      });
    }
    const channelKey = `chat:${channelId}:messages:update`;

    const path = "/api/socket";
    const SocketIO = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path,
      addTrailingSlash: false,
    });

    SocketIO.emit(channelKey, message);
  } catch (error) {
    return {
      error: "Failed to update message",
    };
  }

  revalidatePath(`/servers`);
  return { data: message };
};

export const updateMessage = createSafeAction(UpdateMessageSchema, handler);
