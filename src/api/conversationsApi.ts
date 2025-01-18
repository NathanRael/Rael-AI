import {apiClient} from "@/utils/api.ts";

export interface Conversation {
    id: string;
    title: string;
    user_id: string;
    chatbot_type_id: string;
}

export interface ConversationFilters {
    search?: string
    userId?: string
}

export const fetchConversations = async (options?: ConversationFilters) => {
    const response = await apiClient.get<Conversation[]>(`/api/conversations/${options?.userId}`)
    const conversationList = response.data
    if (options?.search)
        return conversationList.filter(conversation => conversation.title.toLowerCase().includes(options.search!.toLowerCase()));

    return conversationList;
}

export const newConversation = async ({title, user_id, chatbot_type_id}: Omit<Conversation, 'id'>) => {
    let body : Partial<Omit<Conversation, 'id'>> = {
        title,
        user_id,
    }
    
    if (chatbot_type_id !== '')
        body = {...body, chatbot_type_id}
    
    const response = await apiClient.post<Conversation>(`/api/conversations`, body)

    return response.data
}



export const deleteConversation = async (conversationId: string) => {
    apiClient.delete(`/api/conversations/${conversationId}`).then(() => {
    }).catch((error) => {
        console.log(error);
    })
}