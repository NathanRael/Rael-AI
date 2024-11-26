import axios from "axios";
import {BASE_URL} from "@/constants";

export interface Conversation {
    id: string;
    title : string;
    "user_id": string;
}
export const fetchConversations = async () => {
    const response = await axios.get<Conversation[]>(`${BASE_URL}/api/conversations/1`)
    
    return response.data
}

export const newConversation = async ({title, user_id} : Omit<Conversation, 'id'>) => {
    const response = await axios.post<Conversation>(`${BASE_URL}/api/conversations`, {
        title, 
        user_id
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