import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembersWthProfile = Server & {
  members: (Member & { profile: Profile })[];
};
