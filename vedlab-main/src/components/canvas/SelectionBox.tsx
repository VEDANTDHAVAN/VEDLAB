import { useSelf, useStorage } from "@liveblocks/react";
import { memo, useEffect, useRef, useState } from "react";
import useSelectionBounds from "~/hooks/useSelectionBounds";
import { LayerType, Side, type XYWH } from "~/types";
const handleWidth = 10;

const SelectionBox = memo(({onResizeHandlePointerDown}:{
  onResizeHandlePointerDown: (corner: Side, initialBound: XYWH) => void;
  }) => {
  const soleLayerId = useSelf((me) => me.presence.selection.length === 1 ? me.presence.selection[0] : null)
  const isShowingHandles = useStorage((root) => soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path)
  const bounds = useSelectionBounds();
  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  
  useEffect(() => {
   if(textRef.current){
    const bBox = textRef.current.getBBox();
    setTextWidth(bBox.width);
   }
  }, [bounds]);

  if(!bounds) return null;

  const padding = 16;

  return (
   <>
   <rect style={{transform: `translate(${bounds.x}px, ${bounds.y}px)`}}
    className="pointer-events-none fill-transparent stroke-[#0b99ff] stroke-[1px]"
    width={bounds.width} height={bounds.height} />
    <rect className="fill-[#0b99ff]" x={bounds.x + bounds.width/2 - (textWidth + padding)/2} 
     y={bounds.y + bounds.height + 10} width={textWidth + padding} height={20} rx={4}/>
   <text style={{transform: `translate(${bounds.x + bounds.width/2}px, ${bounds?.y + bounds.height + 25}px)`}} 
    textAnchor="middle" ref={textRef}
    className="pointer-events-none select-none fill-white text-[11px]">
     {Math.round(bounds.width)} x {Math.round(bounds.height)}
    </text>
    {isShowingHandles && (
      <>
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "nwse-resize",
          transform: `translate(${bounds.x - handleWidth/2}px, ${bounds.y - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "ns-resize",
          transform: `translate(${bounds.x + bounds.width/2 - handleWidth/2}px, ${bounds.y - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top, bounds);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "nesw-resize",
          transform: `translate(${bounds.x + bounds.width - handleWidth/2}px, ${bounds.y - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "ew-resize",
          transform: `translate(${bounds.x - handleWidth/2}px, ${bounds.y + bounds.height/2 - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Left, bounds);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "nesw-resize",
          transform: `translate(${bounds.x - handleWidth/2}px, ${bounds.y + bounds.height - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "ew-resize",
          transform: `translate(${bounds.x + bounds.width - handleWidth/2}px, ${bounds.y + bounds.height/2 - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Right, bounds);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "nwse-resize",
          transform: `translate(${bounds.x + bounds.width - handleWidth/2}px, ${bounds.y + bounds.height - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "ns-resize",
          transform: `translate(${bounds.x + bounds.width/2 - handleWidth/2}px, ${bounds.y + bounds.height - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom, bounds);
        }}
       />
      </>
    )}
    </>
  );
 }
);

SelectionBox.displayName = "SelectionBox";

export default SelectionBox;