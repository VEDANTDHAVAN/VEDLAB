import type { EllipseLayer } from "~/types";
import { colorToCSS } from "~/utils";

export default function Ellipse({
    id, layer,
} : {id: string, layer: EllipseLayer}) {
    const {x, y, height, width, fill, stroke, opacity} = layer;
    return (
       <g>
        <ellipse 
         style={{transform: `translate(${x}px, ${y}px)`}}
         cx={width/2} cy={height/2} fill={fill ? colorToCSS(fill) : "#00FF00"} 
         stroke={stroke ? colorToCSS(stroke) : "#00FF00"} 
         rx={width/2} ry={height/2} strokeWidth="1" opacity={`${opacity ?? 100}%`}
        />
       </g> 
    )
}