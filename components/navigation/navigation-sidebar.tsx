import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile"
import { database } from "@/lib/database";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItems } from "./navigation-items";
import { ModeToggle } from "../theme-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();
    if(!profile) {
        return redirect("/");
    }
    const servers = database.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });
    return (
        <div className="space-y-3 flex-col items-center h-full w-full text-primary bg-slate-300 dark:bg-slate-900 py-3">
            <NavigationAction />
            <Separator className="h-[3px] bg-slate-400 dark:bg-zinc-600 rounded-lg w-12 mx-auto" />
            <ScrollArea className="flex-1 w-full pl-2 pr-2">
                {(await servers).map((server) => (
                    <div key={server.id} className="mb-3">
                        <NavigationItems 
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-3">
                <ModeToggle />
                <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[40px] w-[40px]"
                        }
                    }}
                />
            </div>
        </div>
    )
}