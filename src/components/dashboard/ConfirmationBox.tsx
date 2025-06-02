const ConfirmationBox = ({isOpen, onClose, onConfirm, message}:{
    isOpen: boolean, onClose: () => void, onConfirm: () => void, message: string
}) => {
 if(!isOpen) return null;

 return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-2">
     <div className="w-full max-w-md rounded-md bg-white p-6 shadow-xl">
      <h2 className="text-sm font-semibold text-gray-900">Confirm</h2>
      <p className="text-xs font-medium text-gray-600 mt-2">{message}</p>
      <div className="mt-4 flex justify-center space-x-4 text-sm">
       <button className="rounded-md bg-white px-2 py-1 text-gray-900 border-gray-900 hover:bg-green-300" onClick={onClose}>Cancel</button> 
       <button className="rounded-md bg-black px-2 py-1 text-white hover:bg-red-400" onClick={onConfirm}>Confirm</button>
      </div>
     </div>
    </div>
 )
}

export default ConfirmationBox;