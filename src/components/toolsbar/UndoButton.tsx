import IconButton from "./IconButton";

export default function UndoButton({onClick, disabled} : {
    onClick: () => void; disabled: boolean;
}) {
    return (
        <IconButton onClick={onClick} disabled={disabled}>
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
          <path d="M12 5V1L3 9l9 8v-4c4.97 0 8.5 1.64 11 5-1-5-4-10-11-10z"/>
         </svg>
        </IconButton>
    )
}