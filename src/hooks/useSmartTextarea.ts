import {useState} from "react";

type UseSmartTextareaProps = {
    maxRows?: number;
    onShiftAndEnter : () => void;
    onEnter : () => void;
    value : string;
}
const useSmartTextarea = ({maxRows = 10, onEnter, onShiftAndEnter, value} : UseSmartTextareaProps) => {
    const [rows, setRows] = useState(1);
    const handleKeyPress = (e : KeyboardEvent) => {
        if (e.shiftKey && e.key === 'Enter') {
            setRows((prev) => prev < maxRows ? prev + 1 : prev)
            onShiftAndEnter()
        }else if (e.key === "Backspace" && (value === "")) {
            setRows((prev) => prev > 1 ? prev - 1 : 1)
        }else if (e.key === "Enter"){
            onEnter()
            setRows(1)
        }
    }
    
    return {handleKeyPress, rows};
}

export default useSmartTextarea