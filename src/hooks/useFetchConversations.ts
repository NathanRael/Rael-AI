import axios from "axios";
import {BASE_URL} from "@/constants";
import {MessageFeedProps} from "@/components/pages/MessageFeed.tsx";
import {useCallback, useState} from "react";

export interface BackendMessages {
    "user_message": string;
    "bot_response": string;
}

const useFetchConversations = () => {
    const [conversations, setConversations] = useState<MessageFeedProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    const fetchConversations = useCallback(async (chatId : string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/messages/${chatId}`, {signal});
            const backendMessages = response.data as BackendMessages[];
            
            
            if (response.status !== 200)
                throw  new Error(`Error fetching conversations`);
            
            // await new Promise((resolve) => setTimeout(() => resolve(true), 2000))
            
            setConversations(() =>
                backendMessages.flatMap((message): MessageFeedProps[] => [
                    {message: message.user_message, sender: 'user'},
                    {message: message.bot_response, sender: 'bot'}
                ]),
            );
        }catch (e) {
            console.error(e);
            setError((e as any).message);
        } finally {
            setLoading(false);
        }
        
/*        const timeOutId = setTimeout(() => {
            abortController.abort('Timeout');
        }, 5000)*/
        
        // return () => clearTimeout(timeOutId);
    }, []);
    
    
    
    return {
        conversations,
        loading,
        error,
        setConversations,
        fetchConversations
    }
}

export default useFetchConversations;