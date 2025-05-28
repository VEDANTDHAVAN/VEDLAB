import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./Rectangle";
import Ellipse from "./Ellipse";
import Path from "./Path";
import { colorToCSS } from "~/utils";

const LayerComponent = memo(({id}: { id: string}) => {
 const layer = useStorage((root) => root.layers.get(id));
 if(!layer){
   return null;
 }
 
 switch(layer.type) {
    case LayerType.Rectangle:
        return <Rectangle id={id} layer={layer} />
    case LayerType.Ellipse:
        return <Ellipse id={id} layer={layer} />
    case LayerType.Path:
        return <Path points={layer.points} x={layer.x} y={layer.y} 
                fill={layer.fill ? colorToCSS(layer.fill) : "#CCC"}
                stroke={layer.stroke ? colorToCSS(layer.stroke) : "#CCC"}
                opacity={layer.opacity}
            />
    default:
        return null;
 }
});

LayerComponent.displayName = "LayerComponent";

export default LayerComponent;