import type React from "react";

export default function IconButton({
    onClick, children, isActive, disabled
}:{
    onClick: () => void; children: React.ReactNode; 
    isActive?: boolean; disabled?: boolean;
}) {
 return (
    <button 
    className={`flex items-center justify-center min-h-[30px] rounded-md text-gray-500 hover:enabled:text-gray-700 focus:enabled:text-gray-600 active:enabled:text-gray-900 disabled:cursor-default disabled:opacity-50 ${isActive ? "bg-gray-200 text-blue-800 hover:enabled:text-blue-800 focus:enabled:text-blue-800 active:enabled:text-blue-600" : ""}`} 
    onClick={onClick} disabled={disabled}>
     {children}
    </button>
 )
}