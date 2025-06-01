import { useStorage } from "@liveblocks/react";
import React, { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./Rectangle";
import Ellipse from "./Ellipse";
import Text from "./Text";
import Path from "./Path";
import { colorToCSS } from "~/utils";

const LayerComponent = memo(({id, onLayerPointerDown}:{ 
    id: string; onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) => {
 const layer = useStorage((root) => root.layers.get(id));
 if(!layer){
   return null;
 }
 
 switch(layer.type) {
    case LayerType.Rectangle:
        return <Rectangle onPointerDown={onLayerPointerDown}
         id={id} layer={layer} />
    case LayerType.Ellipse:
        return <Ellipse onPointerDown={onLayerPointerDown}
         id={id} layer={layer} />
    case LayerType.Path:
        return <Path points={layer.points} x={layer.x} y={layer.y} 
                fill={layer.fill ? colorToCSS(layer.fill) : "#CCC"}
                stroke={layer.stroke ? colorToCSS(layer.stroke) : "#CCC"}
                opacity={layer.opacity} onPointerDown={(e) => onLayerPointerDown(e, id)}
            />
    case LayerType.Text:
        return <Text onPointerDown={onLayerPointerDown} 
        id={id} layer={layer}/>
    default:
        return null;
 }
});

LayerComponent.displayName = "LayerComponent";

export default LayerComponent;