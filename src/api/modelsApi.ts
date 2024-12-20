import axios from "axios";
import {BASE_URL} from "@/constants";


export interface Model {
    name : string;
    capability : string;
}

export const fetchModels = async (formated: boolean = false, model_type?:'vision' | 'embedding' | 'tool') => {
    const response = await axios.get(`${BASE_URL}/api/models/?formated=${formated}`);

    
    if (model_type)
        return (response.data as Model[]).filter((model) => model.capability === model_type);
    
    return response.data as string[];
}
