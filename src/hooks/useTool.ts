import {useState} from "react";
import {Tool} from "@/api/toolsApi.ts";

const useTool = () => {
    const [visible, setVisible] = useState(false)
    const [currentTool, setCurrentTool] = useState<Tool>()
    
    const handleToolClicked = (tool : Tool): void => {
        setCurrentTool(tool)
        setVisible(true)
    }
    
    return {visible, setVisible, currentTool, setCurrentTool, handleToolClicked}
}

export default useTool