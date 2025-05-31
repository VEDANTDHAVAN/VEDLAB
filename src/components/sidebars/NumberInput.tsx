import React, { useEffect, useState, type ChangeEvent, type ReactNode } from "react";

const NumberInput = ({value, min, max, onChange, icon, classNames}:{
    value: number, min?: number, max?: number, onChange: (value: number) => void, 
    icon: ReactNode, classNames?: string,
}) => {
 const [inputValue, setInputValue] = useState(value.toString());

 useEffect(() => {
   setInputValue(value.toString());
 },[value])
 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
 }
 const handleCommit = () => {
    const newValue = parseFloat(inputValue);
    
    if(isNaN(newValue)){
        setInputValue(value.toString());
        return;
    }
    const clampedValue = Math.min(max ?? newValue, Math.max(min ?? newValue, newValue));
    setInputValue(clampedValue.toString());
    onChange(clampedValue);
 }
 const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if(e.key === "Enter"){
    handleCommit();
    (e.currentTarget as HTMLInputElement).blur();// after commit, remove focus from that element
  }
 }

 return (
    <div className={`relative h-fit ${classNames ?? "w-30"}`}>
     <input type="number" value={inputValue} onKeyDown={handleKeyDown}
      onChange={handleChange} onBlur={handleCommit} min={min} max={max}
      className={`h-fit w-full rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 pl-6 text-xs
        hover:border-gray-500`}
     />
     {React.isValidElement(icon) && icon.type === "p" ? (
     <p className="absolute left-2 top-[50%] -translate-y-1/2 text-[10px] text-gray-600">
       {(icon as React.ReactElement<{children: React.ReactNode}>).props.children}
     </p>
     ) : React.cloneElement(icon as React.ReactElement<{className?: string}>, {
        className: "absolute left-1.5 top-[50%] h-3 w-3 -translate-y-1/2 text-gray-600",
     })}
    </div>
 );
};

export default NumberInput;