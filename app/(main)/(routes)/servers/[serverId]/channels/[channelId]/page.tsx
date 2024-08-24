import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    channelId: string;
    serverId: string;
  };
}

const ChannelIdPage = async ({
  params: { channelId, serverId },
}: ChannelIdPageProps) => {
  const { redirectToSignIn } = auth();
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!serverId || !channelId) {
    return redirect("/");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
      server: {
        id: serverId,
        profileId: profile.id,
      },
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: serverId,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader name={channel?.name} type="channel" serverId={serverId} />

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel?.name}
            chatId={channel?.id}
            type="channel"
            apiUrl="/api/messages"
            socketQuery={{
              channelId: channel?.id,
              serverId: channel?.serverId,
            }}
            paramKey="channelId"
            paramValue={channel?.id}
          />
          <ChatInput
            name={channel?.name}
            type="conversation"
            query={{
              serverId: channel?.serverId,
              channelId: channel?.id,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel?.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel?.id} video={true} audio={false} />
      )}
    </div>
  );
};

export default ChannelIdPage;
