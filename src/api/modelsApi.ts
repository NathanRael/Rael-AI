import axios from "axios";
import {BASE_URL} from "@/constants";


export const fetchModels = async (formated: boolean = false, model_type: 'all' | 'vision' | 'embedding' | 'tool' = 'all') => {
    const withModelType =  '&model_type=' + model_type
    const response = await axios.get<string[]>(`${BASE_URL}/api/models/?formated=${formated}${withModelType}`);
    
    return response.data; 
}
