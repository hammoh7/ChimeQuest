import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";

const upload = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("unauthorized!!");
  return { userId: userId };
};

export const ourFileRouter = {
  serverImage: upload({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: upload(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
