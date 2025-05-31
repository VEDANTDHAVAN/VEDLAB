"use client";
import { nanoid } from "nanoid";
import { useCanRedo, useCanUndo, useHistory, useMutation, useMyPresence, useSelf, useStorage } from "@liveblocks/react"
import { colorToCSS, findIntersectingLayersWithRectangle, pencilPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "~/utils";
import LayerComponent from "./LayerComponent";
import { LayerType,type RectangleLayer, type Layer, type Point, type Camera, type EllipseLayer, type CanvasState, CanvasMode, type Textlayer, Side, type XYWH } from "~/types";
import { LiveObject } from "@liveblocks/client";
import React, { useCallback, useEffect, useState } from "react";
import ToolsBar from "../toolsbar/ToolsBar";
import Path from "./Path";
import SelectionBox from "./SelectionBox";
import useDeleteLayers from "~/hooks/useDeleteLayers";
import SelectionTools from "./SelectionTools";
import SideBars from "../sidebars/SideBars";

const MAX_LAYERS = 100;

export default function Canvas() {
    
    const roomColor = useStorage((root) => root.roomColor);//{r: 255, g: 87, b: 51}//
    const layerIds = useStorage((root) => root.layerIds);
    const [camera, setCamera] = useState<Camera>({x: 0, y: 0, zoom: 1})
    const [canvasState, setCanvasState] = useState<CanvasState>({mode: CanvasMode.None})
    const [leftMinimized, setLeftMinimized] = useState(false);
    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();
    const presence = useMyPresence();
    const pencilDraft = useSelf((me) => me.presence.pencilDraft);
    const deleteLayers = useDeleteLayers();
    const selectAllLayers = useMutation(({setMyPresence}) => {
      if(layerIds){
        setMyPresence({selection: [...layerIds]}, {addToHistory: true});
      }
    },[layerIds]);

    useEffect(() => {
     function onKeyDown(e: KeyboardEvent){
      const activeElement = document.activeElement;
      const isInputField = activeElement && 
      (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA");

      if(isInputField) return;

      switch (e.key){
        case "Backspace":
          deleteLayers();
          break;
        case "z":
          if(e.ctrlKey || e.metaKey){
            if(e.shiftKey){
              history.redo();
            } else{
              history.undo();
            }
          }
          break;
        case "a":
          if(e.ctrlKey || e.metaKey){
            selectAllLayers();
            break;
          }
      }
     }

     document.addEventListener("keydown", onKeyDown);

     return () => {
      document.removeEventListener("keydown", onKeyDown);
     }
    }, [deleteLayers])

    const onResizeHandlePointerDown = useCallback((corner: Side, initialBound: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        corner,
        initialBound,
      })
    }, [history]);
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
        setCanvasState({mode: CanvasMode.None});
      }
    }, [],
    );
    //console.log(presence[0].selection);
    //console.log(canvasState.mode);
    const onLayerPointerDown = useMutation(({self, setMyPresence}, e: React.PointerEvent, layerId: string) => {
      if(canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting){
        return;
      }
      history.pause();
      e.stopPropagation();
      if(!self.presence.selection.includes(layerId)){
        setMyPresence({
          selection: [layerId],
        }, {addToHistory: true});
      }
      if(e.nativeEvent.button === 2) {
       setCanvasState({mode: CanvasMode.RightClick});
      }else{
       const point = pointerEventToCanvasPoint(e, camera)
       setCanvasState({mode: CanvasMode.Translating, current: point})
      }
    }, [camera, canvasState.mode, history],);

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
        setMyPresence({selection: []}, {addToHistory: true});
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
      setMyPresence({pencilDraft: null}, {addToHistory: true});
      setCanvasState({ mode: CanvasMode.Pencil });

    }, [history]);

    const onPointerUp = useMutation(({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if(canvasState.mode === CanvasMode.RightClick) return;
      if(canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing){
        unselectLayers();
        setCanvasState({mode: CanvasMode.None});
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
      history.resume();
    }, [ canvasState,setCanvasState, insertLayer, unselectLayers, history])

    const onWheel = useCallback((e: React.WheelEvent) => {
      setCamera((camera) => ({
        x: camera.x - e.deltaX,
        y: camera.y - e.deltaY,
        zoom: camera.zoom,
      }));
    }, []);

    const onPointerDown = useMutation(({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if(canvasState.mode === CanvasMode.RightClick) return;
      if(canvasState.mode === CanvasMode.Dragging){
        setCanvasState({mode: CanvasMode.Dragging , origin: point});
        return;
      }
      if(canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
      if(canvasState.mode === CanvasMode.Inserting) return;
      if(canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing){
        setCanvasState({mode: CanvasMode.Pressing, origin: point})
      }
    }, [ canvasState.mode,setCanvasState, camera, startDrawing])

    const startMultiSelection = useCallback((current: Point, origin: Point) => {
     if(Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5){
      setCanvasState({mode: CanvasMode.SelectionNet, origin, current});
     }
    }, []);

    const updateSelectionNet = useMutation(({storage, setMyPresence}, current: Point, origin: Point) => {
     if(layerIds){
      const layers = storage.get("layers").toImmutable();
      setCanvasState({mode: CanvasMode.SelectionNet, origin, current,});
      const ids = findIntersectingLayersWithRectangle(layerIds, layers, origin, current);
      setMyPresence({selection: ids});
    }
    }, [layerIds])

    const onPointerMove = useMutation(({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

     if(canvasState.mode === CanvasMode.Pressing){
       startMultiSelection(point, canvasState.origin);
     } else if(canvasState.mode === CanvasMode.SelectionNet){
       updateSelectionNet(point, canvasState.origin);
     } else if(canvasState.mode === CanvasMode.Dragging && canvasState.origin !== null){
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
    }, [ canvasState, continueDrawing, camera,
       resizeSelectedLayer, translateSelectedLayer, updateSelectionNet, startMultiSelection])

    return(
    <div className="flex h-screen w-full">
     <main className="overflow-y-auto fixed left-0 right-0 h-screen">
      <div 
       style={{backgroundColor: roomColor ? colorToCSS(roomColor) : "#1e1e1e"}}
       className="h-full w-full touch-none" 
      >
        <SelectionTools camera={camera} canvasMode={canvasState.mode}/>
       <svg onWheel={onWheel} onPointerUp={onPointerUp} 
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
       className="w-full h-full" onContextMenu={(e) => e.preventDefault()}>
        <g style={{transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`}}>
          {layerIds?.map(layerId => (
            <LayerComponent key={layerId} id={layerId} onLayerPointerDown={onLayerPointerDown}/>
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown}/>
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && 
           <rect className="fill-blue-600/5 stroke-blue-600 stroke-[0.5]" 
            x={Math.min(canvasState.origin.x, canvasState.current.x)} 
            y={Math.min(canvasState.origin.y, canvasState.current.y)} 
            width={Math.abs(canvasState.origin.x - canvasState.current.x)}
            height={Math.abs(canvasState.origin.y - canvasState.current.y)}
           />}
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
          }} 
        zoomOut={() => {
            setCamera((camera) => ({...camera, zoom: camera.zoom - 0.1 }))
          }} 
        canZoomIn={camera.zoom < 2} canZoomOut={camera.zoom > 0.4}  
        redo={() => history.redo()} undo={() => history.undo()}
        canRedo={canRedo} canUndo={canUndo}
      />
      <SideBars leftMinimized={leftMinimized} setLeftMinimized={setLeftMinimized}/>
    </div>
    )
}