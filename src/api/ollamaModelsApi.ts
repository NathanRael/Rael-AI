import axios from "axios";
import {BASE_URL} from "@/constants";

export interface OllamaModel {
    name: string;
    description: string;
    capability: string;
    link: string;
    sizes: string[];
}

interface Options {
    search: string;
}

export const fetchOllamaModels = async (options?: Options) => {
    const response = await axios.get<OllamaModel[]>(`${BASE_URL}/api/ollamaModels`, {})

    if (response.status !== 200)
        throw new Error(response.statusText);

    if (options?.search)
        return response.data.filter(model => model.name.toLowerCase().includes(options.search!.toLowerCase()) || model.description.toLowerCase().includes(options.search!.toLowerCase()) || model.sizes.some(size => size.toLowerCase().includes(options.search!.toLowerCase()))
        || model.capability.toLowerCase().includes(options.search!.toLowerCase()));
    

    return response.data;
}