import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./Rectangle";

const LayerComponent = memo(({id}: { id: string}) => {
 const layer = useStorage((root) => root.layers.get(id));
 if(!layer){
   return null;
 }
 
 switch(layer.type) {
    case LayerType.Rectangle:
        return <Rectangle id={id} layer={layer} />
    default:
        return null;
 }
});

LayerComponent.displayName = "LayerComponent";

export default LayerComponent;