import { useSelf, useStorage } from "@liveblocks/react";
import { useEffect, useRef, useState } from "react";
import { LayerType, Side, type XYWH } from "~/types";
const handleWidth = 10;

export default function SelectionBox({onResizeHandlePointerDown}:{onResizeHandlePointerDown: (corner: Side, initialBound: XYWH) => void;}){
  const soleLayerId = useSelf((me) => me.presence.selection.length === 1 ? me.presence.selection[0] : null)
  const isShowingHandles = useStorage((root) => soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path)
  const layers = useStorage((root) => root.layers);
  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  
  const layer = soleLayerId ? layers?.get(soleLayerId) : null;
  
  useEffect(() => {
   if(textRef.current){
    const bBox = textRef.current.getBBox();
    setTextWidth(bBox.width);
   }
  }, [layer])

  if(!layer) return null;

  const padding = 16;

  return <>
   <rect style={{transform: `translate(${layer?.x}px, ${layer?.y}px)`}}
    className="pointer-events-none fill-transparent stroke-[#0b99ff] stroke-[1px]"
    width={layer?.width} height={layer?.height} />
    <rect className="fill-[#0b99ff]" x={layer.x + layer.width/2 - (textWidth + padding)/2} 
     y={layer.y + layer.height + 10} width={textWidth + padding} height={20} rx={4}/>
   <text style={{transform: `translate(${layer.x + layer.width/2}px, ${layer?.y + layer.height + 25}px)`}} 
    textAnchor="middle" ref={textRef}
    className="pointer-events-none fill-white text-[11px]">
     {Math.round(layer.width)} x {Math.round(layer.height)}
    </text>
    {isShowingHandles && (
      <>
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "nwse-resize",
          transform: `translate(${layer.x - handleWidth/2}px, ${layer.y - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top + Side.Left, layer);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "ns-resize",
          transform: `translate(${layer.x + layer.width/2 - handleWidth/2}px, ${layer.y - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top, layer);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "nesw-resize",
          transform: `translate(${layer.x + layer.width - handleWidth/2}px, ${layer.y - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top + Side.Right, layer);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "ew-resize",
          transform: `translate(${layer.x - handleWidth/2}px, ${layer.y + layer.height/2 - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Left, layer);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "nesw-resize",
          transform: `translate(${layer.x - handleWidth/2}px, ${layer.y + layer.height - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom + Side.Left, layer);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "ew-resize",
          transform: `translate(${layer.x + layer.width - handleWidth/2}px, ${layer.y + layer.height/2 - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Right, layer);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "nwse-resize",
          transform: `translate(${layer.x + layer.width - handleWidth/2}px, ${layer.y + layer.height - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom + Side.Right, layer);
        }}
       />
       <rect className="fill-white stroke-[#0b99ff] stroke-[1px]"
         style={{
          width: `${handleWidth}px`, height: `${handleWidth}px`, cursor: "ns-resize",
          transform: `translate(${layer.x + layer.width/2 - handleWidth/2}px, ${layer.y + layer.height - handleWidth/2}px)`
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom, layer);
        }}
       />
      </>
    )}
  </> 
}