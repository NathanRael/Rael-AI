import {ChangeEvent, useCallback, useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "@/constants";
import {MessageFeedProps} from "@/pages/Main.tsx";

const useMessage = ({registerConversation} : {registerConversation : (message : MessageFeedProps['message'], sender : MessageFeedProps['sender']) => void }) => {
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    
    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }, []);
    const handleSubmit = async () => {
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

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !submitting && message.trim() !== '') {
                handleSubmit();
            }
        };

        document.addEventListener('keypress', handleKeyPress);

        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [submitting, message])
    
    
    return {message, submitting, handleSubmit, handleInput};
}

export default useMessage;