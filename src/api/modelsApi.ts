import axios from "axios";
import {BASE_URL} from "@/constants";


export const fetchModels = async () => {
    const response = await axios.get<string[]>(`${BASE_URL}/api/models`)
    
    return response.data; 
}
