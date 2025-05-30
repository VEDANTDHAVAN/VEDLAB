"use client";
import { nanoid } from "nanoid";
import { useMutation, useMyPresence, useSelf, useStorage } from "@liveblocks/react"
import { colorToCSS, pencilPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "~/utils";
import LayerComponent from "./LayerComponent";
import { LayerType,type RectangleLayer, type Layer, type Point, type Camera, type EllipseLayer, type CanvasState, CanvasMode, type Textlayer, Side, type XYWH } from "~/types";
import { LiveObject } from "@liveblocks/client";
import React, { useCallback, useState } from "react";
import ToolsBar from "../toolsbar/ToolsBar";
import Path from "./Path";
import SelectionBox from "./SelectionBox";

const MAX_LAYERS = 100;

export default function Canvas() {

    const roomColor = useStorage((root) => root.roomColor);//{r: 255, g: 87, b: 51}//
    const layerIds = useStorage((root) => root.layerIds);
    const [camera, setCamera] = useState<Camera>({x: 0, y: 0, zoom: 1})
    const [canvasState, setCanvasState] = useState<CanvasState>({mode: CanvasMode.None})
    const pencilDraft = useSelf((me) => me.presence.pencilDraft);
    const presence = useMyPresence();
    const onResizeHandlePointerDown = useCallback((corner: Side, initialBound: XYWH) => {
      setCanvasState({
        mode: CanvasMode.Resizing,
        corner,
        initialBound,
      })
    }, []);
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
      } else if(layerType === LayerType.Text){
        layer = new LiveObject<Textlayer>({
          type: LayerType.Text,
          x: position.x,
          y: position.y,
          text: "Write here",
          height: 100,
          width: 100,
          fontSize: 16,
          fontWeight: 400,
          fontFamily: "Ariel",
          fill: {r: 217, g: 217, b: 217},
          stroke: {r: 217, g: 217, b: 217},
          opacity: 100,
        })
      }

      if(layer) {
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({selection: [layerId]}, {addToHistory: true});
      }
    }, [],
    );
    console.log(presence[0].selection);
    const onLayerPointerDown = useMutation(({self, setMyPresence}, e: React.PointerEvent, layerId: string) => {
      if(canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting){
        return;
      }

      e.stopPropagation();
      if(!self.presence.selection.includes(layerId)){
        setMyPresence({
          selection: [layerId],
        });
      }
      const point = pointerEventToCanvasPoint(e, camera)

      setCanvasState({mode: CanvasMode.Translating, current: point})
    }, [canvasState.mode, camera, canvasState.mode],);

    const resizeSelectedLayer = useMutation(({storage, self}, point: Point) => {
     if(canvasState.mode !== CanvasMode.Resizing) {
      return;
     }

     const bounds = resizeBounds(canvasState.initialBound, canvasState.corner, point);
     //update layers to set new widths and heights of the layer
     const liveLayers = storage.get("layers");

     if(self.presence.selection.length > 0){
      const layer = liveLayers.get(self.presence.selection[0]!);
      if(layer){
        layer.update(bounds);
      }
     }
    }, [canvasState]);

    const translateSelectedLayer = useMutation(({storage, self}, point: Point) => {
     if(canvasState.mode !== CanvasMode.Translating) {
      return;
     }

     const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y,
     }
     const liveLayers = storage.get("layers");
     for(const id of self.presence.selection){
      const layer = liveLayers.get(id);
      if(layer){
        layer.update({
          x: layer.get("x") + offset.x,
          y: layer.get("y") + offset.y,
        });
      }
     }
     setCanvasState({mode: CanvasMode.Translating, current: point});
    }, [canvasState]);

    const unselectLayers = useMutation(({self, setMyPresence}) => {
      if(self.presence.selection.length > 0){
        setMyPresence({selection: []});
      }
    }, []);

    const startDrawing = useMutation(({setMyPresence}, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: {r: 150, g: 100, b: 200},
      })
    }, []);

    const continueDrawing = useMutation(({ self, setMyPresence}, point: Point, e: React.PointerEvent) => {
      const {pencilDraft} = self.presence;

      if(canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft === null) {
        return;
      }


      setMyPresence({
        pencilDraft: [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    }, [canvasState.mode]);

    const insertPath = useMutation(({storage, self, setMyPresence}) => {
      const liveLayers = storage.get("layers");
      const {pencilDraft} = self.presence;

      if(pencilDraft === null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS) {
        setMyPresence({pencilDraft: null});
        return;
      }

      const id = nanoid();
      liveLayers.set(id, 
        new LiveObject(pencilPointsToPathLayer(pencilDraft, {r: 150, g: 100, b: 200}))
      );
    
      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);
      setMyPresence({pencilDraft: null});
      setCanvasState({ mode: CanvasMode.Pencil });

    }, [])

    const onPointerUp = useMutation(({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if(canvasState.mode === CanvasMode.None){
        setCanvasState({mode: CanvasMode.None});
        unselectLayers();
      } else if(canvasState.mode === CanvasMode.Inserting){
        insertLayer(
          canvasState.layerType,
          point,
        );
      } else if(canvasState.mode === CanvasMode.Dragging){
        setCanvasState({mode: CanvasMode.Dragging, origin: null})
      } else if(canvasState.mode === CanvasMode.Pencil){
        insertPath();
      } else {
        setCanvasState({mode: CanvasMode.None});
      }

    }, [ canvasState,setCanvasState, insertLayer, unselectLayers])

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
        setCanvasState({mode: CanvasMode.Dragging , origin: point});
        return;
      }
      if(canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
    }, [ canvasState.mode,setCanvasState, camera, startDrawing])

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
      } else if(canvasState.mode === CanvasMode.Pencil){
        continueDrawing(point, e);
      } else if(canvasState.mode === CanvasMode.Resizing){
        resizeSelectedLayer(point);
      } else if(canvasState.mode === CanvasMode.Translating){
        translateSelectedLayer(point);
      }
    }, [ canvasState,setCanvasState, insertLayer, continueDrawing, resizeSelectedLayer, translateSelectedLayer])

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
            <LayerComponent key={layerId} id={layerId} onLayerPointerDown={onLayerPointerDown}/>
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown}/>
          {pencilDraft !== null && pencilDraft.length > 0  
          && <Path x={0} y={0} fill={colorToCSS({r: 217, g: 217, b: 217})} opacity={100} points={pencilDraft} />}
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