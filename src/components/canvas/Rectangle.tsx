import type { RectangleLayer } from "~/types";
import { colorToCSS } from "~/utils";

export default function Rectangle({
    id, layer, onPointerDown
} : {
  id: string, layer: RectangleLayer, onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) {
    const {x, y, height, width, fill, stroke, opacity, cornerRadius} = layer;
    return (
    <g className="group">
      {/* Hover Border */}
       <rect className="pointer-events-none opacity-0 group-hover:opacity-100"
        style={{transform: `translate(${x}px, ${y}px)`}} strokeLinecap="round" strokeLinejoin="round"
        width={width} height={height} fill="none" stroke="#0b99ff" strokeWidth={4}/>
      {/* Main Rectangle */}
      <rect onPointerDown={(e) => onPointerDown(e, id)}
       style={{transform: `translate(${x}px, ${y}px)`}}
       width={width} height={height} fill={fill ? colorToCSS(fill) : "#00FF00"} 
       strokeWidth={1} stroke={stroke ? colorToCSS(stroke) : "#00FF00"}
       opacity={`${opacity ?? 100}%`} rx={cornerRadius ?? 0} ry={cornerRadius ?? 0}
      />
      
    </g>
   )
}