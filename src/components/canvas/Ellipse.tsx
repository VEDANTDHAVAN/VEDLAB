import type { EllipseLayer } from "~/types";
import { colorToCSS } from "~/utils";

export default function Ellipse({
    id, layer, onPointerDown
} : {id: string, layer: EllipseLayer, onPointerDown: (e: React.PointerEvent, layerId: string) => void;}) {
    const {x, y, height, width, fill, stroke, opacity} = layer;
    return (
       <g className="group">
        {/* Hover Border */}
       <ellipse className="pointer-events-none opacity-0 group-hover:opacity-100"
        style={{transform: `translate(${x}px, ${y}px)`}} rx={width/2} ry={height/2}
        cx={width/2} cy={height/2} fill="none" stroke="#0b99ff" strokeWidth={4}/>
       {/* Main Ellipse */}
        <ellipse onPointerDown={(e) => onPointerDown(e, id)}
         style={{transform: `translate(${x}px, ${y}px)`}}
         cx={width/2} cy={height/2} fill={fill ? colorToCSS(fill) : "#00FF00"} 
         stroke={stroke ? colorToCSS(stroke) : "#00FF00"} 
         rx={width/2} ry={height/2} strokeWidth="1" opacity={`${opacity ?? 100}%`}
        />
       </g> 
    )
}