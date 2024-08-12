import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const currentProfile = async () => {
  const { userId, redirectToSignIn } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
