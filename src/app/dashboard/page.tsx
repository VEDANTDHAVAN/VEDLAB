"use server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import UserMenu from "~/components/dashboard/UserMenu";
import CreateRoom from "~/components/dashboard/CreateRoom";
import ViewRooms from "~/components/dashboard/ViewRooms";

export default async function Page() {
    const session = await auth();
    const user = await db.user.findUniqueOrThrow({
     where: {
        id: session?.user.id,
     },
     include: {
      ownedRooms: true,
      roomInvites: {
        include: {
            room: true,
        }
      }
     }
    })

    return (
        <div className="flex h-screen w-full">
            <div className="flex h-screen min-w-[270px] flex-col border-r border-gray-200 bg-white p-2">
             <UserMenu email={user.email} />
            </div>
            <div className="flex h-screen w-full flex-col">
             <div className="flex min-h-[50px] items-center border-b border-gray-300 bg-white pl-8">
              <h2 className="text-[14px] font-bold">Recents</h2>
             </div>
             <div className="flex h-full flex-col gap-10 p-8">
              <CreateRoom />  
              <ViewRooms key={user.id} ownedRooms={user.ownedRooms} roomInvites={user.roomInvites.map(x => x.room)}/>
             </div>
            </div>
        </div>
    )
}