import { CanvasMode, LayerType, type CanvasState } from "~/types";
import SelectionButton from "./SelectionButton";
import ShapesSelectionBtn from "./ShapesSelectionBtn";
import ZoomInButton from "./ZoomInButton";
import ZoomOutButton from "./ZoomOutButton";
import PencilButton from "./PencilButton";

export default function ToolsBar({
    canvasState, setCanvasState, zoomIn, zoomOut, 
    canZoomIn, canZoomOut
}: {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    zoomIn: () => void; zoomOut: () => void;
    canZoomIn: boolean; canZoomOut: boolean;
}){
  return (
  <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center rounded-lg bg-white p-2 shadow-[0_0_3px_rgba(0,0,0,20)]">
    <div className="flex justify-center items-center gap-3">
     <SelectionButton 
     isActive={canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Dragging} 
     canvasMode={canvasState.mode} 
     onClick={(canvasMode) => setCanvasState(canvasMode === CanvasMode.Dragging ? {mode: canvasMode, origin: null} : {mode: canvasMode})} 
     />
     <ShapesSelectionBtn 
     isActive={canvasState.mode === CanvasMode.Inserting &&
      [LayerType.Rectangle, LayerType.Ellipse].includes(canvasState.layerType)}
      canvasState={canvasState}
      onClick={(layerType) => setCanvasState({mode: CanvasMode.Inserting, layerType})}  
    />
    <PencilButton isActive={canvasState.mode === CanvasMode.Pencil} onClick={() => setCanvasState({mode: CanvasMode.Pencil})}/>
    <div className="w-[1px] self-stretch bg-black/10" />
    <div className="flex items-center justify-center gap-3">
      <ZoomInButton onClick={zoomIn} disabled={!canZoomIn} />
      <ZoomOutButton onClick={zoomOut} disabled={!canZoomOut}/>
    </div>
    </div>
  </div>
  )
}