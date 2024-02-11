
import FirstModal from "@/components/modals/first-modal";
import { database } from "@/lib/database";
import { Profile } from "@/lib/profile";
import { redirect } from "next/navigation";

const Setup = async () => {
    const profile = await Profile();
    const server = await database.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    if(server) {
        return redirect(`/servers/${server.id}`)
    }
    return ( 
        <FirstModal />
     );
}
 
export default Setup;