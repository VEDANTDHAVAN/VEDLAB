import { useEffect, useState, type ChangeEvent } from "react";

const DropDown = ({value, onChange, options, className}:{
    value: string, onChange: (value: string) => void, options: string[], className?: string
}) => {
 const [selectedValue, setSelectedValue] = useState(value);

 useEffect(() => {
  setSelectedValue(value);
 }, [value])

 const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onChange(newValue);
 }

 return (
 <div className={`relative ${className ?? ""}`}>
  <select value={selectedValue} onChange={handleChange} className="w-full rounded-lg border
 border-gray-300 bg-gray-100 px-2 py-1 text-xs hover:bg-gray-300">
    {options.map((option) => (
        <option key={option} value={option}>
            {option}
        </option>
    ))}
 </select>
 </div>
 );
};

export default DropDown;