import useSelectionBounds from "~/hooks/useSelectionBounds";
import { CanvasMode, type Camera } from "~/types";
import {BsArrowDown, BsArrowUp} from "react-icons/bs";
import { useMutation, useSelf } from "@liveblocks/react";
import { memo } from "react";

function SelectionTools({camera, canvasMode}:{
    camera: Camera, canvasMode: CanvasMode
}){
    const selection = useSelf((me) => me.presence.selection);
    const bringToFront = useMutation(({storage}) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = []; //type to specify that it is an array of numbers
      const arr = liveLayerIds.toArray();

      for(let i = 0; i < arr.length; i++){
        const element = arr[i];
        if(element !== undefined && selection?.includes(element)){
            indices.push(i);
        }
      }

      for(let i = indices.length - 1; i>=0; i--){
        const element = indices[i];
        if(element !== undefined){
            liveLayerIds.move(element, arr.length - 1 - (indices.length - 1 - i));
        }
      }
    }, [selection]);
    const sendToBack = useMutation(({storage}) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = []; //type to specify that it is an array of numbers
      const arr = liveLayerIds.toArray();

      for(let i = 0; i < arr.length; i++){
        const element = arr[i];
        if(element !== undefined && selection?.includes(element)){
            indices.push(i);
        }
      }

      for(let i = 0; i < indices.length; i++){
        const element = indices[i];
        if(element !== undefined){
            liveLayerIds.move(element, i);
        }
      }
    }, [selection]);

    const selectionBounds = useSelectionBounds();
    if(!selectionBounds){
        return null;
    }
    const x = (selectionBounds.width/2 + selectionBounds.x)*camera.zoom + camera.x;
    const y = selectionBounds.y + camera.zoom + camera.y;

    if(canvasMode !== CanvasMode.RightClick) return null;

    return (
    <div style={{transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,}}
    className="absolute flex flex-col min-w-[150px] rounded-xl bg-[#1e1e1e] p-1 shadow-lg">
    <button onClick={bringToFront} className="flex w-full items-center justify-between rounded-md text-white p-2 hover:bg-blue-500">
        <span className="text-xs">Bring to Front</span>
        <BsArrowDown className="h-4 w-4" />
    </button>
    <button onClick={sendToBack} className="flex w-full items-center justify-between rounded-md text-white p-2 hover:bg-blue-500">
        <span className="text-xs">Send to Back</span>
        <BsArrowUp className="h-4 w-4" />
    </button>
    </div>
 )
}

export default memo(SelectionTools);