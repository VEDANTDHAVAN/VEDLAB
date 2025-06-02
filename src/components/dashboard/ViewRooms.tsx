"use client";

import type { Room } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";
import SketchCanvas from "../canvas/SketchCanvas";
import React from "react";
import { useRouter } from "next/navigation";
import ConfirmationBox from "./ConfirmationBox";
import { deleteRoom, updateRoomTitle } from "~/app/actions/rooms";

const COLORS = [
 "rgb(52, 152, 219)", //Sky Blue
 "rgb(231, 76, 60)", //Red Coral
 "rgb(46, 204, 113)", //Mint Green
 "rgb(155, 89, 182)", //Amethyst Purple
 "rgb(241, 196, 15)", //Bright Yellow
 "rgb(26, 188, 156)", //Teal
 "rgb(230, 126, 34)", //Orange
 "rgb(149, 165, 166)", //Silver Gray
 "rgb(52, 73, 94)", //Dark Slate
 "rgb(243, 156, 18)", //Amber
]

export default function ViewRooms({ownedRooms, roomInvites}:{
    ownedRooms: Room[], roomInvites: Room[]
}){
  const [viewMode, setViewMode] = useState("owns");
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const outerDivRef = useRef<HTMLDivElement>(null);

  const filterRooms = useMemo(() => {
   if(viewMode === "owns"){
    return ownedRooms;
   } else if(viewMode === "shared"){
    return roomInvites;
   }
   return [];
  }, [viewMode, ownedRooms, roomInvites])

  const roomColors = useMemo(() => {
    return filterRooms.map((room, index) => ({
      id: room.id, color: COLORS[index % COLORS.length],
    }));
  },[filterRooms])

  useEffect(() => {
   const handleClickOutside = (e: MouseEvent) => {
    if(outerDivRef.current && !outerDivRef.current.contains(e.target as Node)){
      setSelected(null);
    }
   }

   document.addEventListener("mousedown", handleClickOutside);

   return () => document.removeEventListener("mousedown", handleClickOutside);
  },[])
  
  return (
     <div className="flex flex-col gap-5" ref={outerDivRef}>
      <div className="flex gap-1">
       {viewModeButton({ onSelect: () => setViewMode("owns"), active: viewMode === "owns", text: "My Project" })}
       {viewModeButton({ onSelect: () => setViewMode("shared"), active: viewMode === "shared", text: "Shared Projects" })}
      </div>
      <div className="flex flex-wrap gap-4">{filterRooms.map((room) => {
        const roomColor = roomColors.find((rc) => rc.id === room.id)?.color ?? COLORS[0]!;
        return <React.Fragment key={room.id}><SingleRoom id={room.id} title={room.title} 
        description={`Created ${room.createdAt.toDateString()}`} color={roomColor} selected={selected === room.id}
         select={() => setSelected(room.id)} navigateTo={() => router.push("/dashboard/" + room.id)}
         canEdit={viewMode === "owns"}
        /></React.Fragment>
      })}</div>
      <SketchCanvas />
     </div>
    );
}


function viewModeButton({onSelect, active, text}:{
  onSelect: () => void, active: boolean, text: string,
}) {
  return (
  <button className={`select-none rounded-md p-2 text-[12px] hover:bg-gray-200 
    ${active ? "bg-gray-200" : ""}`} onClick={onSelect}>
   {text} 
  </button>
 );
}

function SingleRoom({id, title, description, color, selected, select, navigateTo, canEdit}:{
  id: string, title: string, description: string, color: string, selected: boolean, 
  select: () => void, navigateTo: () => void, canEdit: boolean,
}){
 const [isEditing, setIsEditing] = useState(false);
 const [editedTitle, setEditedTitle] = useState(title);
 const [showConfirmation, setShowConfirmation] = useState(false);

 const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  if(e.key === "Enter"){
    e.preventDefault();
    setIsEditing(false);
    await updateRoomTitle(editedTitle, id);
  }
 }

 const handleBlur = async () => {
  setIsEditing(false);
  await updateRoomTitle(editedTitle, id);
 }

 const confirmDelete = async () => {
  await deleteRoom(id);
  setShowConfirmation(false);
 }

 useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Backspace" && selected && !isEditing){
      e.preventDefault();
      setShowConfirmation(true);
    }
  }

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  }
 }, [selected, id, isEditing])

 return (
  <div className="flex flex-col gap-1">
   <div onDoubleClick={navigateTo} onClick={select} style={{backgroundColor: color}}
       className={`flex h-60 w-100 cursor-pointer items-center justify-center rounded-md
        ${selected ? "border-2 border-blue-600":"border border-gray-200"}`}
   >
    <p className="text-xl select-none font-semibold">{title}</p>
   </div>
   {isEditing && canEdit ? (
    <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}
     onBlur={handleBlur} onKeyDown={handleKeyPress} autoFocus className="w-full"
   /> 
  ) : (
  <p onClick={() => setIsEditing(true)} className="mt-2 select-none text-[14px] font-medium">{title}</p>
  )}
  <p className="select-none text-[10px] text-gray-500">{description}</p>
   <ConfirmationBox isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} onConfirm={confirmDelete}
      message="Are You sure You want to Delete this Room?"
    />
  </div>
 )
}