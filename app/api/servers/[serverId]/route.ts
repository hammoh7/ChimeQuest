import { currentProfile } from "@/lib/current-profile";
import { database } from "@/lib/database";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const server = await database.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
            }
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVERID_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const server = await database.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name, imageUrl,
            }
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVERID_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}