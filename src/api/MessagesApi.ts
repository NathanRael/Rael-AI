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
    file_id: string;
}


export const fetchMessages = async (conversationId: string) => {
    return axios.get<Message[]>(`${BASE_URL}/api/messages/${conversationId}`).then((response) => {
        return response.data;
    })

}


export const createMessage = async ({content, model, conversation_id, sender = 'user', chatbot_type_id}: {
    content: string,
    model: string,
    conversation_id: string,
    sender?: 'user' | 'bot',
    chatbot_type_id: string
}) => {
    const response = await axios.post(`${BASE_URL}/api/messages/create`, {
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
export const newStreamedMessage = async ({
                                             content,
                                             model,
                                             conversation_id,
                                             sender = 'user',
                                             chatbot_type_id,
                                             file_id,
                                             onFinish,
                                             onChange
                                         }: {
    content: string,
    model: string,
    conversation_id: string,
    sender?: 'user' | 'bot',
    chatbot_type_id: string,
    file_id?: string,
} & {
    onChange: (chunk: string) => void,
    onFinish: (fullMessage: string) => void
}) => {
    let body: any = {
        content,
        model,
        conversation_id,
        sender,
        chatbot_type_id,
    }

    if (file_id !== '')
        body = {...body, file_id}

    const response = await fetch(`${BASE_URL}/api/messages/streamed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
        throw new Error('No response body available.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';

    while (true) {
        const {done, value} = await reader.read();

        if (done) {
            onFinish(fullMessage);
            break;
        }

        const chunk = decoder.decode(value, {stream: true});
        fullMessage += chunk;
        onChange(chunk)
    }
}


// export const newMessage = async ({content, model, conversation_id, sender = 'user', chatbot_type_id}: {
//     content: string,
//     model: string,
//     conversation_id: string,
//     sender?: 'user' | 'bot',
//     chatbot_type_id: string
// }) => {
//     const response = await axios.post(`${BASE_URL}/api/messages`, {
//         content,
//         model,
//         conversation_id,
//         sender,
//         chatbot_type_id
//     })
//     if (response.status !== 200)
//         throw new Error(response.statusText)
//
//     return response.data as Message;
// }
