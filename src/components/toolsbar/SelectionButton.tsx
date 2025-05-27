import { useEffect, useRef, useState } from "react";
import { CanvasMode } from "~/types";
import IconButton from "./IconButton";
import { BiPointer } from "react-icons/bi";
import { RiHand } from "react-icons/ri";

export default function SelectionButton({
    isActive, canvasMode, onClick,
}:{
    isActive: boolean; 
    canvasMode: CanvasMode; 
    onClick: (canvasMode: CanvasMode.None | CanvasMode.Dragging) => void;
}){
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const handleClick = (canvasMode: CanvasMode.None | CanvasMode.Dragging) => {
    onClick(canvasMode);
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
     <IconButton isActive={isActive} onClick={() => onClick(CanvasMode.None)}>
      {canvasMode !== CanvasMode.None && canvasMode !== CanvasMode.Dragging && (
        <BiPointer className="h-5 w-5"/>
      )}
      {canvasMode === CanvasMode.None && <BiPointer className="h-5 w-5"/>}
      {canvasMode === CanvasMode.Dragging && <RiHand className="h-5 w-5" />}
     </IconButton>
     <button onClick={() => setIsOpen(!isOpen)} className="ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
      <path d="M12 4L6 10H10V20H14V10H18L12 4Z"/>
      </svg>
     </button>
     {isOpen && (
        <div className="absolute -top-20 mt-1 min-w-[150px] rounded-xl bg-[#171717] p-2 shadow-lg">
         <button 
          className={`flex w-full items-center rounded-md p-1 text-white hover:bg-blue-500 ${canvasMode === CanvasMode.None ? "bg-blue-500" : ""}`}
          onClick={() => handleClick(CanvasMode.None)}>
          <span className="text-xs w-5">
            {canvasMode === CanvasMode.None && "✔"}</span>
          <BiPointer className="mr-3 h-4 w-4"/>
          <span className="text-xs">Move</span>
         </button>
         <button 
          className={`flex w-full items-center rounded-md p-1 text-white hover:bg-blue-500 ${canvasMode === CanvasMode.Dragging ? "bg-blue-500" : ""}`}
          onClick={() => handleClick(CanvasMode.Dragging)}>
          <span className="text-xs w-5">
            {canvasMode === CanvasMode.Dragging && "✔"}</span>
          <RiHand className="mr-3 h-4 w-4"/>
          <span className="text-xs">Hand Tool</span>
         </button>
        </div>
     )}
    </div>
  )
}