import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { iconMap, roleIconMap } from "@/lib/const";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
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

  if (!server) {
    return redirect("/");
  }

  const textChannels = server?.channels?.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server?.channels?.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server?.channels?.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members?.filter(
    (member) => member?.profileId !== profile.id
  );

  const role = server?.members?.find(
    (member) => member?.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((textChannel) => {
                  const Icon = iconMap[textChannel?.type];
                  return {
                    icon: <Icon className="h-4 w-4" />,
                    id: textChannel?.id,
                    name: textChannel?.name,
                  };
                }),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((audioChannel) => {
                  const Icon = iconMap[audioChannel?.type];
                  return {
                    icon: <Icon className="h-4 w-4" />,
                    id: audioChannel?.id,
                    name: audioChannel?.name,
                  };
                }),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((videoChannel) => {
                  const Icon = iconMap[videoChannel?.type];
                  return {
                    icon: <Icon className="h-4 w-4" />,
                    id: videoChannel?.id,
                    name: videoChannel?.name,
                  };
                }),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  icon: roleIconMap[member?.role],
                  id: member?.id,
                  name: member?.profile?.name,
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            {textChannels?.map((channel) => (
              <ServerChannel
                key={channel?.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            {audioChannels?.map((channel) => (
              <ServerChannel
                key={channel?.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            {videoChannels?.map((channel) => (
              <ServerChannel
                key={channel?.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Members"
              server={server}
            />
            {members?.map((member) => (
              <ServerMember key={member?.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
