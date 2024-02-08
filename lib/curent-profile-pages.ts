import { getAuth } from "@clerk/nextjs/server";
import { database } from "./database";
import { NextApiRequest } from "next";

export const profilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await database.profile.findUnique({
    where: {
      userId,
    },
  });
  return profile;
};