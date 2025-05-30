import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "~/utils";

export default function Path({x, y, stroke, fill, opacity, points, onPointerDown}: {
  x: number; y: number; stroke?: string; onPointerDown?: (e: React.PointerEvent) => void;
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
        return (
          <g className="group">
          <path className="pointer-events-none opacity-0 group-hover:opacity-100"
          style={{transform: `translate(${x}px, ${y}px)`}}
          d={pathData} 
          fill="none" 
          stroke="#0b99ff"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          />
          <path onPointerDown={onPointerDown}
          style={{transform: `translate(${x}px, ${y}px)`}}
          d={pathData} 
          fill={fill} 
          stroke={stroke ?? "#CCC"}
          strokeWidth={1}
          opacity={`${opacity ?? 100}%`}
          />
          </g>
        )
    }