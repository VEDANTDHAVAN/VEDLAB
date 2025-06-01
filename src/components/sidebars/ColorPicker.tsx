import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

const ColorPicker = ({value, onChange, className}:{
    value: string,
    onChange: (value: string) => void,
    className?: string,
}) => {
   const [inputValue, setInputValue] = useState(value);
   const [isPickerOpen, setIsPickerOpen] = useState(false);
   const pickerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    setInputValue(value);
   }, [value]);

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if(pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
            setIsPickerOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    }
   }, [pickerRef])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
   }

   const handleCommit = () => {
    if(/^#[0-9a-f]{6}$/i.test(inputValue)) {
        onChange(inputValue);
    } else{
        setInputValue(value);
    }
 }

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
        handleCommit();
        (e.currentTarget as HTMLInputElement).blur();
    }
   }

   const handleColorChange = (color: string) => {
    setInputValue(color);
    onChange(color);
   }

   return <div ref={pickerRef} className={`relative h-fit ${className ?? "w-30"}`}>
    <input type="text" value={inputValue} onChange={handleChange}
     onBlur={handleCommit} onKeyDown={handleKeyDown}
     className="h-fit w-full rounded-lg border pl-8 border-[#f7f5f5] bg-gray-100 px-2 py-1
      text-sm hover:border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div onClick={() => setIsPickerOpen(!isPickerOpen)} style={{backgroundColor: inputValue}} 
    className="absolute left-1.5 top-[50%] h-4 w-4 -translate-y-1/2 cursor-pointer rounded-2xl " />
    {isPickerOpen && 
    <div className="absolute left-0 z-10 mt-3 -translate-x-[125px]">
     <HexColorPicker color={inputValue} onChange={handleColorChange} />     
    </div>}
   </div>
}; 

export default ColorPicker;