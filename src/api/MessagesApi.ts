import axios from "axios";
import {BASE_URL} from "@/constants";


/*
interface FetchedMessage {
    id: number;
    content : string;
    "conversation_id": number;
    sender: string;
}
*/

export interface Message {
    id: string;
    sender: 'user' | 'bot';
    content: string;
}


export const fetchMessages = async (conversationId: string) => {
    return axios.get<Message[]>(`${BASE_URL}/api/messages/${conversationId}`).then((response) => {
        return response.data;
    })

}

export const newMessage = async ({content, model, conversation_id, sender = 'user', chatbot_type_id}: {
    content: string,
    model: string,
    conversation_id: string,
    sender?: 'user' | 'bot',
    chatbot_type_id: string
}) => {
    const response = await axios.post(`${BASE_URL}/api/messages`, {
        content,
        model,
        conversation_id,
        sender,
        chatbot_type_id
    })
    if (response.status !== 200)
        throw new Error(response.statusText)

    return response.data as Message;
}