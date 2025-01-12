import axios, {AxiosResponse} from "axios";
import {BASE_URL} from "@/constants";

export interface ChatbotType {
    id: string;
    name: string;
    description: string;
    suggested_models :string;
}

interface FetchChatbotTypeOptions {
    id?: string;
    conversationId?: string;
}


export const fetchChatbotTypes = async ({search}: { search?: string }) => {
    const response = await axios.get<ChatbotType[]>(`${BASE_URL}/api/chatbotTypes`);
    
    
    if (search)
        return response.data.filter(chatbotType => chatbotType.name.toLowerCase().includes(search.toLowerCase()) || chatbotType.description.toLowerCase().includes(search.toLowerCase()));


    return response.data
}

export const fetchMainChatbotTypes = async (userId :string) => {
    const response = await axios.get<ChatbotType[]>(`${BASE_URL}/api/chatbotTypes/mainChatbotTypes/${userId}`);
    
    if (response.status !== 200)
        throw new Error(response.statusText);
    
    return response.data;
}


export const fetchChatbotType = async (options: FetchChatbotTypeOptions) => {
    let response: AxiosResponse<ChatbotType> = {} as AxiosResponse<ChatbotType>;

    if (options.id)
        response = await axios.get<ChatbotType>(`${BASE_URL}/api/chatbotTypes/${options.id}`)
    else if (options.conversationId)
        response = await axios.get(`${BASE_URL}/api/chatbotTypes/conversations/${options.conversationId}`)

    return response.data
}