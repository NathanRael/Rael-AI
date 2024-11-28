import axios, {AxiosResponse} from "axios";
import {BASE_URL} from "@/constants";

export interface ChatbotType {
    id : string;
    name : string;
    // context : string;
    description : string;
}

interface FetchChatbotTypeOptions {
    id?: string;
    conversationId?: string;
}

export const fetchChatbotTypes = async () => {
    const response = await axios.get<ChatbotType[]>(`${BASE_URL}/api/chatbotTypes`);
    
    return response.data
}


export const fetchChatbotType = async (options : FetchChatbotTypeOptions) => {
    let response : AxiosResponse<ChatbotType> = {} as  AxiosResponse<ChatbotType>;
    
    if (options.id)
        response = await axios.get<ChatbotType>(`${BASE_URL}/api/chatbotTypes/${options.id}`)
    else if (options.conversationId)
        response = await axios.get(`${BASE_URL}/api/chatbotTypes/conversations/${options.conversationId}`)
    
    return response.data
}