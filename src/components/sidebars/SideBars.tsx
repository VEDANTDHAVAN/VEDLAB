"use client";

import { useMutation, useOthers, useSelf, useStorage } from "@liveblocks/react";
import Link from "next/dist/client/link";
import { colorToCSS, connectionIdToColor, hexToRGB } from "~/utils";
import {PiPathFill, PiSidebarSimpleDuotone, PiSidebarSimpleThin} from "react-icons/pi";
import { LayerType, type Color } from "~/types";
import { IoEllipseOutline, IoSquareOutline } from "react-icons/io5";
import { AiOutlineFontSize } from "react-icons/ai";
import LayerButton from "./LayerButton";
import NumberInput from "./NumberInput";
import { BsCircleHalf } from "react-icons/bs";
import { RiRoundedCorner } from "react-icons/ri";
import ColorPicker from "./ColorPicker";
import DropDown from "./DropDown";
import "@fontsource/lora";
import "@fontsource/montserrat";
import "@fontsource/open-sans";
import "@fontsource/oswald";
import "@fontsource/playfair-display";
import "@fontsource/poppins";
import "@fontsource/raleway";
import "@fontsource/roboto";
import "@fontsource/source-code-pro";
import UserAvatar from "./UserAvatar";

export default function SideBars({leftMinimized, setLeftMinimized}:{
    leftMinimized: boolean, setLeftMinimized: (value: boolean) => void,
}){
    const me = useSelf();
    const others = useOthers();
    const selectedLayer = useSelf((me) => {
        const selection = me.presence.selection;
        return selection.length === 1 ? selection[0] : null;
    });
    const layer = useStorage((root) => {
        if(!selectedLayer){
         return null;
        }
        return root.layers.get(selectedLayer);
    });

    const roomColor = useStorage((root) => root.roomColor);
    const layers = useStorage((root) => root.layers);
    const layerIds = useStorage((root) => root.layerIds);
    const reversedLayerIds = [...layerIds ?? []].reverse();
    const selection = useSelf((me) => me.presence.selection);

    const setRoomColor = useMutation(({storage}, newColor: Color)=> {
      storage.set("roomColor", newColor);
    },[])

    const updateLayer = useMutation(({storage}, updates: {
     x?: number, y?: number, width?: number, height?: number,
     opacity?: number, cornerRadius?: number, fill?: string, 
     stroke?: string, fontSize?: number, fontWeight?: number, 
     fontFamily?: string,
    }) => {
     if(!selectedLayer) return;

     const liveLayers = storage.get("layers");
     const layer = liveLayers.get(selectedLayer);
     if(layer){
        layer.update({
            ...(updates.x !== undefined && {x: updates.x}),
            ...(updates.y !== undefined && {y: updates.y}),
            ...(updates.width !== undefined && {width: updates.width}),
            ...(updates.height !== undefined && {height: updates.height}),
            ...(updates.opacity !== undefined && {opacity: updates.opacity}),
            ...(updates.cornerRadius !== undefined && {cornerRadius: updates.cornerRadius}),
            ...(updates.fill !== undefined && {fill: hexToRGB(updates.fill)}),
            ...(updates.stroke !== undefined && {stroke: hexToRGB(updates.stroke)}),
            ...(updates.fontSize !== undefined && {fontSize: updates.fontSize}),
            ...(updates.fontWeight !== undefined && {fontWeight: updates.fontWeight}),
            ...(updates.fontFamily !== undefined && {fontFamily: updates.fontFamily}),
        })
     }
    },[selectedLayer]);

    const fontOptions = [
      "Roboto",
      "Poppins",
      "Montserrat",
      "Open Sans",
      "Lora",
      "Source Code Pro",
      "Playfair Display",
      "Oswald",
      "Raleway"
    ];

    return (
    <>
    {/* Left SideBar */}
     {!leftMinimized ? (
     <div className="fixed left-0 flex h-screen w-[240px] flex-col border-r border-gray-200 bg-white">
      <div className="p-4">
        <div className="flex justify-between">
         <Link href="/dashboard">
          <img src="/vedlab.png" alt="VedLab Logo" className="h-[20px] w-[20px]"/>
         </Link>
         <PiSidebarSimpleThin onClick={() => setLeftMinimized(true)} className="h-5 w-5 cursor-pointer"/>
        </div>
       <h2 className="mt-2 scroll-m-20 text-[14px] font-medium">RoomName</h2>
      </div>
      <div  className="border-b border-gray-300"/> 
      <div className="flex flex-col gap-1 p-2">
        <span className="mb-2 text-[12px] font-medium">Layers</span>
        {layerIds && reversedLayerIds.map((id) => {
         const layer = layers?.get(id);
         const isSelected = selection?.includes(id);
         if(layer?.type === LayerType.Rectangle){
          return (
           <LayerButton layerId={id} text="Rectangle" isSelected={isSelected ?? false} key={id}
             icon={<IoSquareOutline className={`h-4 w-4 text-gray-500 ${isSelected ? "bg-white" : ""}`}/>}
           />
          )
         } else if(layer?.type === LayerType.Ellipse){
          return (
            <LayerButton layerId={id} text="Ellipse" isSelected={isSelected ?? false} key={id}
                icon={<IoEllipseOutline className={`h-4 w-4 text-gray-500 ${isSelected ? "bg-white" : ""}`}/>}
            />
            )
        } else if(layer?.type === LayerType.Path){
          return (
            <LayerButton layerId={id} text="Path" isSelected={isSelected ?? false} key={id}
                icon={<PiPathFill className={`h-4 w-4 text-gray-500 ${isSelected ? "bg-white" : ""}`}/>}
            />
            )
         } else if(layer?.type === LayerType.Text){
          return (
            <LayerButton layerId={id} text="Text" isSelected={isSelected ?? false} key={id}
                icon={<AiOutlineFontSize className={`h-4 w-4 text-gray-500 ${isSelected ? "bg-white" : ""}`}/>}
            />
            )
         }
        })}
      </div>
     </div>
    ) : (
     <div className="fixed left-3 top-3 h-[50px] w-[250px] items-center justify-between 
     flex rounded-xl border bg-white p-4">
        <Link href="/dashboard">
         <img src="/vedlab.png" alt="VedLab Logo" className="h-[20px] w-[20px]"/>
        </Link>
        <h2 className="scroll-m-20 text-[14px] font-medium">RoomName</h2>
        <PiSidebarSimpleDuotone onClick={() => setLeftMinimized(false)} className="h-5 right-0 w-5 cursor-pointer"/>
      </div>
    )}
 
    {/* Right SideBar */}
    {!leftMinimized || layer ? 
     <div className={`fixed ${leftMinimized && layer ? "bottom-3 right-3 top-3 rounded-xl" : ""} 
     ${!leftMinimized && !layer ? "h-screen" : ""} ${!leftMinimized && layer ? 
     "bottom-0 top-0 h-screen" : ""} right-0 w-[250px] flex flex-col border-l border-gray-400
      bg-white`}>
     <div className="flex items-center justify-between pr-2">
      <div className="flex w-full max-36 gap-2 overflow-x-scroll p-3 text-xs">
        {me && (<UserAvatar color={connectionIdToColor(me.connectionId)} name={me.info.name}/>)}
      </div>
      <p>Share Button</p>
     </div>
     <div className="border-b border-gray-300" />
     {layer ? (<>
      <div className="flex flex-col gap-2 p-4">
      <span className="mb-2 text-[12px] font-medium">Position</span>
      <div className="flex flex-col gap-1 ">
        <p className="text-[10px] font-medium text-gray-600">Position</p>
      <div className="flex w-full gap-2">
        <NumberInput value={layer.x} onChange={(number) => {
          updateLayer({x: number});
        }} classNames="w-1/2" icon={<p>X</p>}/>
        <NumberInput value={layer.y} onChange={(number) => {
          updateLayer({y: number});
        }} classNames="w-1/2" icon={<p>Y</p>}/>
      </div>
     </div>
     </div>
     {layer.type !== LayerType.Path && (
      <>
      <div className="border-b border-gray-300"/>
      <div className="flex flex-col gap-2 p-4">
      <span className="mb-2 text-[12px] font-medium">Layout</span>
      <div className="flex flex-col gap-1 ">
        <p className="text-[10px] font-medium text-gray-600">Dimensions</p>
      <div className="flex w-full gap-2">
        <NumberInput value={layer.width} onChange={(number) => {
          updateLayer({width: number});
        }} classNames="w-1/2" icon={<p>W</p>}/>
        <NumberInput value={layer.height} onChange={(number) => {
          updateLayer({height: number});
        }} classNames="w-1/2" icon={<p>H</p>}/>
      </div>
      </div>
      </div>
      </>
     )}
     <div className="border-b border-gray-300"/>
      <div className="flex flex-col gap-2 p-4">
      <span className="mb-2 text-[12px] font-medium">Appearance</span>
      <div className="flex w-full gap-2">
      <div className="flex w-1/2 flex-col gap-1 ">
        <p className="text-[10px] font-medium text-gray-600">Opacity</p>
        <NumberInput value={layer.opacity} onChange={(number) => {
          updateLayer({opacity: number});
        }} min={0} max={100}
        classNames="w-full" icon={<BsCircleHalf />}/>
      </div>
      {layer.type === LayerType.Rectangle && (
        <div className="flex w-1/2 flex-col gap-1 ">
        <p className="text-[10px] font-medium text-gray-600">Corner Radius</p>
        <NumberInput value={layer.cornerRadius ?? 0} onChange={(number) => {
          updateLayer({cornerRadius: number});
        }} min={0} max={100}
        classNames="w-full" icon={<RiRoundedCorner />}/>
      </div>
      )}
      </div>
      </div>
      <div className="border-b border-gray-300" />
      <div className="flex flex-col gap-2 p-4">
       <span className="mb-2 text-[12px] font-medium">Fill</span>
       <ColorPicker value={colorToCSS(layer.fill)} onChange={(color) => {
          updateLayer({fill: color, stroke: color});
        }} 
       />
      </div>
      <div className="border-b border-gray-300" />
      <div className="flex flex-col gap-2 p-4">
       <span className="mb-2 text-[12px] font-medium">Stroke</span>
       <ColorPicker value={colorToCSS(layer.stroke)} onChange={(color) => {
          updateLayer({stroke: color});
        }} 
       />
      </div>
      {layer.type === LayerType.Text && (<>
        <div className="border-b border-gray-300" />
        <div className="flex flex-col gap-2 p-4">
        <span className="mb-2 text-[12px] font-medium">Typography</span>
        <div className="flex flex-col gap-1">
          <DropDown value={layer.fontFamily} onChange={(value) => {
            updateLayer({fontFamily: value});
          }} options={fontOptions}/>
          <div className="flex w-full gap-2">
            <div className="flex w-full flex-col gap-1">
              <p className="text-[10px] font-medium text-gray-600">Size</p>
              <NumberInput value={layer.fontSize} onChange={(number) => {
                updateLayer({fontSize: number});
              }} classNames="w-full" icon={<p>S</p>}/>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p className="text-[10px] font-medium text-gray-600">Weight</p>
              <DropDown value={layer.fontWeight.toString()} onChange={(value) => {
                updateLayer({fontWeight: Number(value)});
              }} options={["100", "200", "300", "400", "500", "600", "700", "800", "900"]}/>
            </div>
          </div>
        </div>
        </div>
      </>)}
     </> 
    ) : <div className="flex flex-col gap-2 p-4">
       <span className="mb-2 text-[12px] font-medium">Page</span>
       <ColorPicker value={roomColor ? colorToCSS(roomColor) : "#1e1e1e"} 
         onChange={(color) => {
          const rgbColor = hexToRGB(color);
          setRoomColor(rgbColor);
         }}
       />
      </div>}
    </div> : 
    <div className="fixed right-3 top-3 flex h-[48px] w-[250px] items-center
     justify-between rounded-xl border bg-white pr-2">
      <div className="flex w-full max-36 gap-2 overflow-x-scroll p-3 text-xs">
        {me && (<UserAvatar color={connectionIdToColor(me.connectionId)} name={me.info.name}/>)}
      </div>
      <p>Share Button</p>
    </div>
    }
    </>
    )
}