import type { Color } from "~/types";
import { getStroke } from "perfect-freehand";
import { colorToCSS, getSvgPathFromStroke } from "~/utils";

export default function Path({x, y, stroke, fill, opacity, points}: {
  x: number; y: number; stroke?: string; 
  fill: string; opacity: number; points: number[][];
}) {
        const pathData = getSvgPathFromStroke(
            getStroke(points, {
            size: 20, //sets thickness of stroke
            thinning: 0.5, //stroke width changes on how fast you move the cursor
            smoothing: 0.5, //how sharp the corners will be, when you change directions while drawing
            streamline: 0.5, //helpsto smoothen the line even if you shake cursor
        })
    );
        return <path 
          style={{transform: `translate(${x}px, ${y}px)`}}
          d={pathData} 
          fill={fill} 
          stroke={stroke ?? "#CCC"}
          strokeWidth={1}
          opacity={`${opacity ?? 100}%`}
        />;
    }