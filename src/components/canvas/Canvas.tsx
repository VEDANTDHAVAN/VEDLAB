"use client";
import { nanoid } from "nanoid";
import { useMutation, useStorage } from "@liveblocks/react"
import { colorToCSS, pointerEventToCanvasPoint } from "~/utils";
import LayerComponent from "./LayerComponent";
import { LayerType,type RectangleLayer, type Layer, type Point, type Camera, type EllipseLayer, type CanvasState, CanvasMode } from "~/types";
import { LiveObject } from "@liveblocks/client";
import React, { useCallback, useState } from "react";
import ToolsBar from "../toolsbar/ToolsBar";

const MAX_LAYERS = 100;

export default function Canvas() {

    const roomColor = useStorage((root) => root.roomColor);//{r: 255, g: 87, b: 51}//
    const layerIds = useStorage((root) => root.layerIds);
    const [camera, setCamera] = useState<Camera>({x: 0, y: 0, zoom: 1})
    const [canvasState, setCanvasState] = useState<CanvasState>({mode: CanvasMode.None})
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

      else if(layerType === LayerType.Ellipse){
        layer = new LiveObject<EllipseLayer>({
         type: LayerType.Ellipse,
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

      if(canvasState.mode === CanvasMode.None){
        setCanvasState({mode: CanvasMode.None})
      } else if(canvasState.mode === CanvasMode.Inserting){
        insertLayer(
          canvasState.layerType,
          point,
        );
      } else if(canvasState.mode === CanvasMode.Dragging){
        setCanvasState({mode: CanvasMode.Dragging, origin: null})
      }

    }, [ canvasState,setCanvasState, insertLayer])

    const onWheel = useCallback((e: React.WheelEvent) => {
      setCamera((camera) => ({
        x: camera.x - e.deltaX,
        y: camera.y - e.deltaY,
        zoom: camera.zoom,
      }));
    }, []);

    const onPointerDown = useMutation(({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if(canvasState.mode === CanvasMode.Dragging){
        setCanvasState({mode: CanvasMode.Dragging , origin: point})
      }
    }, [ canvasState.mode,setCanvasState, camera])

    const onPointerMove = useMutation(({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if(canvasState.mode === CanvasMode.Dragging && canvasState.origin !== null){
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        
        setCamera((camera) => ({
          x: camera.x + deltaX,
          y: camera.y + deltaY,
          zoom: camera.zoom,
        }));
      }
    }, [ canvasState,setCanvasState, insertLayer])

    return(
    <div className="flex h-screen w-full">
     <main className="overflow-y-auto fixed left-0 right-0 h-screen">
      <div 
       style={{backgroundColor: roomColor ? colorToCSS(roomColor) : "#1e1e1e"}}
       className="h-full w-full touch-none" 
      >
       <svg onWheel={onWheel} onPointerUp={onPointerUp} 
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
       className="w-full h-full">
        <g style={{transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`}}>
          {layerIds?.map(layerId => (
            <LayerComponent key={layerId} id={layerId}/>
          ))}
        </g>
       </svg>
      </div>
     </main>
     <ToolsBar 
          canvasState={canvasState} setCanvasState={(newState) => setCanvasState(newState)} 
          zoomIn={() => {
            setCamera((camera) => ({...camera, zoom: camera.zoom + 0.1 }))
          }} zoomOut={() => {
            setCamera((camera) => ({...camera, zoom: camera.zoom - 0.1 }))
          }} canZoomIn={camera.zoom < 2} canZoomOut={camera.zoom > 0.4}  />
    </div>
    )
}