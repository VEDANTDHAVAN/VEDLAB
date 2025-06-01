"use client"

import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {ClientSideSuspense, LiveblocksProvider, RoomProvider} from "@liveblocks/react";
import type { ReactNode } from "react";
import type { Layer } from "~/types";

export function Room({children, roomId}: {children: ReactNode, roomId: string}) {
 return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
             id={roomId}
             initialPresence={{
                 selection: [],
                 cursor: null,
                 penColor: null,
                 pencilDraft: null,
             }}
             initialStorage={{
                 roomColor: { r: 40, g: 40, b: 30 },
                 layers: new LiveMap<string, LiveObject<Layer>>(),
                 layerIds: new LiveList([]),
             }}
        >
         
         <ClientSideSuspense fallback={
           <div className="flex h-screen items-center justify-center flex-col gap-3">
            <img 
             src="/vedlab.png" alt="Logo" 
             className="h-[50px] w-[50px] animate-bounce"   
            />
            <h1 className="text-sm font-semibold">Loading....</h1>
           </div>}>
          {children}
         </ClientSideSuspense>
        </RoomProvider>
    </LiveblocksProvider>
 )
}