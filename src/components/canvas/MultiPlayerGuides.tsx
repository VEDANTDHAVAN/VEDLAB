import { shallow, useOthersConnectionIds, useOthersMapped } from "@liveblocks/react";
import { memo } from "react";
import Cursor from "./Cursor";
import Path from "./Path";
import { colorToCSS } from "~/utils";

function Cursors(){
 const ids = useOthersConnectionIds();
 return (
    <>{ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId}/>
    ))}
    </>
 );
}

function Drafts() {
    const others = useOthersMapped((other) => ({
        pencilDraft: other.presence.pencilDraft, penColor: other.presence.penColor
    }), shallow,
 );

 return (
    <>
     {others.map(([key, other]) => {
      if(other.pencilDraft){
       return <Path key={key} x={0} y={0} points={other.pencilDraft} opacity={100}
        fill={other.penColor ? colorToCSS(other.penColor) : "#CCC"}/>
      } 
      return null;
     })}

    </>
 )
}

export default memo(function MultiPlayerGuides(){
    return ( 
    <>
    <Cursors />
    <Drafts />
    </> 
 )
})