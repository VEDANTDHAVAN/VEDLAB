import { useOther } from "@liveblocks/react";
import { memo } from "react";
import { connectionIdToColor } from "~/utils";

function Cursor({connectionId}:{connectionId: number}) {
 const cursor = useOther(connectionId, (user) => user.presence.cursor);

 if(!cursor){
    return null;
 }

 const {x, y} = cursor;

 return (
  <path style={{transform: `translate(${x}px,${y}px)`}}
   fill={connectionIdToColor(connectionId)}
  d="M2 2L20 12L14 14L12 20L2 2Z" />
 )
}

export default memo(Cursor);