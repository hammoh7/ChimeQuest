import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { database } from "./database";

export const Profile = async () => {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const profile = await database.profile.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (profile) {
    return profile;
  }
  const newProfile = await database.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};
