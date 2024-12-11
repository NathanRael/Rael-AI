import axios from "axios";
import {BASE_URL} from "@/constants";


export const fetchModels = async (formated: boolean = false) => {
    const response = await axios.get<string[]>(`${BASE_URL}/api/models/?formated=${formated}`);
    
    return response.data; 
}
