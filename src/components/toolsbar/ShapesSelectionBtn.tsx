import { useEffect, useRef, useState } from "react";
import { CanvasMode, LayerType, type CanvasState } from "~/types";
import IconButton from "./IconButton";
import { IoSquareOutline, IoEllipseOutline } from "react-icons/io5";

export default function ShapesSelectionBtn({
    isActive, canvasState, onClick,
}:{
    isActive: boolean; 
    canvasState: CanvasState; 
    onClick: (layerType: LayerType.Rectangle | LayerType.Ellipse) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const handleClick = (layerType: LayerType.Rectangle | LayerType.Ellipse) => {
      onClick(layerType);
      setIsOpen(false);
    }
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
       if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
       }
      };
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    return (
     <div className="relative flex" ref={menuRef}>
      <IconButton isActive={isActive} onClick={() => onClick(LayerType.Rectangle)}>
       {canvasState.mode !== CanvasMode.Inserting 
       && (<IoSquareOutline className="h-5 w-5"/>)}
       {canvasState.mode === CanvasMode.Inserting 
       && canvasState.layerType === LayerType.Rectangle
       && (<IoSquareOutline className="h-5 w-5"/>)}
       {canvasState.mode === CanvasMode.Inserting 
       && canvasState.layerType === LayerType.Ellipse 
       && (<IoEllipseOutline className="h-5 w-5"/>)}
      </IconButton>
     <button onClick={() => setIsOpen(!isOpen)} className="ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
      <path d="M12 4L6 10H10V20H14V10H18L12 4Z"/>
      </svg>
     </button>
     {isOpen && (
        <div className="absolute -top-20 mt-1 min-w-[150px] rounded-xl bg-[#171717] p-2 shadow-lg">
         <button 
          className={`flex w-full items-center rounded-md p-1 text-white hover:bg-blue-500 ${canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle ? "bg-blue-500" : ""}`}
          onClick={() => handleClick(LayerType.Rectangle)}>
          <span className="text-xs w-5">
            {canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle && "✔"}</span>
          <IoSquareOutline className="mr-3 h-4 w-4"/>
          <span className="text-xs">Rectangle</span>
         </button>
         <button 
          className={`flex w-full items-center rounded-md p-1 text-white hover:bg-blue-500 ${canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse ? "bg-blue-500" : ""}`}
          onClick={() => handleClick(LayerType.Ellipse)}>
          <span className="text-xs w-5">
            {canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse && "✔"}</span>
          <IoEllipseOutline className="mr-3 h-4 w-4"/>
          <span className="text-xs">Ellipse</span>
         </button>
        </div>
     )}
    </div>
    )
}