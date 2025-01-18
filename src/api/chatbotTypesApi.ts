import {AxiosResponse} from "axios";
import {apiClient} from "@/utils/api";

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
    const response = await apiClient.get<ChatbotType[]>(`/api/chatbotTypes`);
    
    
    if (search)
        return response.data.filter(chatbotType => chatbotType.name.toLowerCase().includes(search.toLowerCase()) || chatbotType.description.toLowerCase().includes(search.toLowerCase()));


    return response.data
}

export const fetchMainChatbotTypes = async (userId :string) => {
    const response = await apiClient.get<ChatbotType[]>(`/api/chatbotTypes/mainChatbotTypes/${userId}`);
    
    if (response.status !== 200)
        throw new Error(response.statusText);
    
    return response.data;
}


export const fetchChatbotType = async (options: FetchChatbotTypeOptions) => {
    let response: AxiosResponse<ChatbotType> = {} as AxiosResponse<ChatbotType>;

    if (options.id)
        response = await apiClient.get<ChatbotType>(`/api/chatbotTypes/${options.id}`)
    else if (options.conversationId)
        response = await apiClient.get(`/api/chatbotTypes/conversations/${options.conversationId}`)

    return response.data
}