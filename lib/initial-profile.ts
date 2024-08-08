import { currentUser, auth } from "@clerk/nextjs/server";

import { db } from "./db";

export const initialProfile = async () => {
  const { redirectToSignIn } = auth();
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (profile) return profile;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    },
  });

  return newProfile;
};
