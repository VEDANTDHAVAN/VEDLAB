"use client"

import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {ClientSideSuspense, LiveblocksProvider, RoomProvider} from "@liveblocks/react";
import type { ReactNode } from "react";
import type { Layer } from "~/types";
import Image from "next/image";

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
            <Image 
             src="/vedlab.png" alt="Logo" 
             width={50} 
             height={50}
             className="animate-bounce"   
            />
            <h1 className="text-sm font-semibold">Loading....</h1>
           </div>}>
          {children}
         </ClientSideSuspense>
        </RoomProvider>
    </LiveblocksProvider>
 )
}