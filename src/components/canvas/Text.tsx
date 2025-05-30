import { useMutation } from "@liveblocks/react";
import React, { useEffect, useRef, useState } from "react";
import type { Textlayer } from "~/types";
import { colorToCSS } from "~/utils";

export default function Text({
    id, layer, onPointerDown
} : {id: string, layer: Textlayer, onPointerDown: (e: React.PointerEvent, layerId: string) => void,}) {
    const {x, y, height, text, fontSize, fontFamily, fontWeight, width, fill, stroke, opacity} = layer;

    const [inputValue, setInputValue] = useState(text);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateText = useMutation(({storage}, newText: string) => {
        const liveLayers = storage.get("layers");
        const layer = liveLayers.get(id);
        if(layer){
            layer.update({text: newText})
        }
    }, [id],);

    useEffect(() => {
     if(isEditing && inputRef.current){
      inputRef.current.focus();
     }
    }, [isEditing])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }
    const handleBlur = () => {
      setIsEditing(false);
      //save to LiveBlocks Storage
      updateText(inputValue);
    }
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if(e.key === "Enter") {
            setIsEditing(false);
            //save to LiveBlocks Storage
            updateText(inputValue);
        }
    }
    const handleDoubleClick = () => {
        setIsEditing(true);
    }   

    return (
       <g onDoubleClick={handleDoubleClick} className="group">
        {isEditing ? (<foreignObject x={x} y={y} width={width} height={height}>
            <input ref={inputRef}
             style={{fontSize: `${fontSize}px`, color: colorToCSS(fill), width: "100%", 
                     border: "none", outline: "none", background: "transparent",}}
             type="text" value={inputValue} onChange={handleChange}
             onBlur={handleBlur} onKeyDown={handleKeyDown}
            />
        </foreignObject>) : (
            <>
            {/* Hover Border */}
            <rect className="pointer-events-none opacity-0 group-hover:opacity-100"
             style={{transform: `translate(${x}px, ${y}px)`}} strokeLinecap="round" strokeLinejoin="round"
             width={width} height={height} fill="none" stroke="#0b99ff" strokeWidth={2}/>
            {/* Main Rectangle */}
            <text onPointerDown={(e) => onPointerDown(e, id)}
            x={x} y={y + fontSize} fontSize={fontSize} fontWeight={fontWeight} opacity={`${opacity}%`}
            fontFamily={fontFamily} fill={colorToCSS(fill)} stroke={colorToCSS(stroke)}
           >
            {text}
           </text>
           </>
        )}
       </g>
    )
}