"use client";
import { nanoid } from "nanoid";
import { useMutation, useStorage } from "@liveblocks/react"
import { colorToCSS, pointerEventToCanvasPoint } from "~/utils";
import LayerComponent from "./LayerComponent";
import { LayerType,type RectangleLayer, type Layer, type Point, type Camera } from "~/types";
import { LiveObject } from "@liveblocks/client";
import React, { useState } from "react";

const MAX_LAYERS = 100;

export default function Canvas() {

    const roomColor = useStorage((root) => root.roomColor);//{r: 255, g: 87, b: 51}//
    const layerIds = useStorage((root) => root.layerIds);
    const [camera, setCamera] = useState<Camera>({x: 0, y: 0, z: 0, zoom: 1})
    //New function to Insert layer using  Liveblocks - hook
    const insertLayer = useMutation((
        {storage, setMyPresence}, 
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text, 
        position: Point,    
    ) => {
      const liveLayers = storage.get("layers");
      if(liveLayers.size >= MAX_LAYERS){
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      //using nanoid npm package
      const layerId = nanoid();
      let layer: LiveObject<Layer> | null = null;

      if(layerType === LayerType.Rectangle){
        layer = new LiveObject<RectangleLayer>({
            type: LayerType.Rectangle,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: {r: 89, g: 255, b: 197},
            stroke: {r: 89, g: 255, b: 197},
            opacity: 100,
        });
      }

      if(layer) {
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({selection: [layerId]}, {addToHistory: true});
      }
    }, [],
    );

    const onPointerUp = useMutation(({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      insertLayer(LayerType.Rectangle, point);
    }, [])

    return(
    <div className="flex h-screen w-full">
     <main className="overflow-y-auto fixed left-0 right-0 h-screen">
      <div 
       style={{backgroundColor: roomColor ? colorToCSS(roomColor) : "#1e1e1e"}}
       className="h-full w-full touch-none" 
      >
       <svg onPointerUp={onPointerUp} className="w-full h-full">
        <g>
          {layerIds?.map(layerId => (
            <LayerComponent key={layerId} id={layerId}/>
          ))}
        </g>
       </svg>
      </div>
     </main>
    </div>
    )
}