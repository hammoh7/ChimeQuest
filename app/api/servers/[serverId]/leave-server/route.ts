import { currentProfile } from "@/lib/current-profile";
import { database } from "@/lib/database";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("ServerId missing", { status: 400 });
    }
    const server = await database.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
            deleteMany: {
                profileId: profile.id
            }
        }
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERID_LEAVE]", error);
    return new NextResponse("Invalid error", { status: 500 });
  }
}
