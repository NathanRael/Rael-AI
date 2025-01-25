import {apiClient} from "@/utils/api.ts";


export interface Model {
    name : string;
    capability : string;
}

export const fetchModels = async (formated: boolean = false, model_type?:'vision' | 'embedding' | 'tool') => {
    const response = await apiClient.get(`/api/models/?formated=${formated}`);
    
    if (model_type)
        return (response.data as Model[]).filter((model) => model.capability === model_type);
    
    return response.data as string[];
}
