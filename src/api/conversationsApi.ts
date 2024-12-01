import axios from "axios";
import {BASE_URL} from "@/constants";

export interface Conversation {
    id: string;
    title: string;
    user_id: string;
    chatbot_type_id: string;
}

export interface ConversationFilters {
    search?: string
    userId: string
}

export const fetchConversations = async (options?: ConversationFilters) => {
    const response = await axios.get<Conversation[]>(`${BASE_URL}/api/conversations/${options?.userId}`)
    const conversationList = response.data
    if (options?.search)
        return conversationList.filter(conversation => conversation.title.toLowerCase().includes(options.search!.toLowerCase()));

    return conversationList;
}

export const newConversation = async ({title, user_id, chatbot_type_id}: Omit<Conversation, 'id'>) => {
    const response = await axios.post<Conversation>(`${BASE_URL}/api/conversations`, {
        title,
        user_id,
        chatbot_type_id
    })

    return response.data
}



export const deleteConversation = async (conversationId: string) => {
    axios.delete(`${BASE_URL}/api/conversations/${conversationId}`).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(error);
    })
}