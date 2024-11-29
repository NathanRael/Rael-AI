import axios from "axios";
import {BASE_URL} from "@/constants";



export const fetchTest = async () => {

    const response = await axios.post(`http://localhost:11434/api/generate`, {
        "model": "llama3",
        "prompt":"Why is the sky blue?"
    })
    
    // Object.entries(response.data => response.data )
    // console.log(response.data);
    
    return response.data;
}