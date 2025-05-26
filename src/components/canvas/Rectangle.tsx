import type { RectangleLayer } from "~/types";
import { colorToCSS } from "~/utils";

export default function Rectangle({
    id, layer,
} : {id: string, layer: RectangleLayer}) {
    const {x, y, height, width, fill, stroke, opacity, cornerRadius} = layer;
    return (
    <g>
      <rect 
       style={{transform: `translate(${x}px, ${y}px)`}}
       width={width} height={height} fill={fill ? colorToCSS(fill) : "#00FF00"} 
       strokeWidth={1} stroke={stroke ? colorToCSS(stroke) : "#00FF00"}
       opacity={opacity} rx={cornerRadius ?? 0} ry={cornerRadius ?? 0}
      />
      
    </g>
   )
}