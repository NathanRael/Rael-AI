import {ChangeEvent, useCallback, useState} from "react";
import axios from "axios";
import {BASE_URL} from "@/constants";

type UseMessageProps = {
    registerConversation : (message: string, sender : 'user' | 'bot' ) => void;
}

const useMessage = ({registerConversation} : UseMessageProps) => {
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    
    const handleInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }, []);

    const handleSubmitMessage = async () => {
        // -TODO : Sending api request
        if (message === '')
            return

        registerConversation(message, 'user');
        setSubmitting(true);
        setMessage('');
        try {
            const response = await axios.post(`${BASE_URL}/api/message`, {message});

            if (response.status === 200){
                console.log('Response : ', response)
                registerConversation(response.data.message, 'bot');
            }else {
                console.warn('Unexpected response structure:', response);
            }
        } catch (e) {
            console.error('Error from the backend : ', (e as any).message || e)
        } finally {
            setSubmitting(false)
        }
    }

    
    
    return {
        message, submitting, handleInput, handleSubmitMessage, setMessage
    }
}

export default useMessage; 