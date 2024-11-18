import {ChangeEvent, useCallback, useState} from "react";
import axios from "axios";
import {BASE_URL} from "@/constants";
import * as React from "react";
import {useToast} from "rael-ui"
import useScroll from "@/hooks/useScroll.ts";

type UseMessageProps = {
    registerConversation : (message: string, sender : 'user' | 'bot' ) => void;
    selectedModel?: string;
}

const useMessage = ({registerConversation, selectedModel} : UseMessageProps) => {
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {toast} = useToast();
    const {scrollToBottom} = useScroll();
    
    
    
    const handleInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }, []);

    const handleSubmitMessage = async (message : string, chatId : string,  setMessage : React.Dispatch<React.SetStateAction<string>>) => {
        console.log('message : ', message)
        
        // -TODO : Sending api request
        if (message === '' || !message)
            return
        
        
        
        if (selectedModel === '') {
            toast({
                title: 'Error',
                message: 'Please select a model',
            })
            return console.error('Please select a model')
        }    
        
        
        registerConversation(message, 'user');
        setSubmitting(true);
        setMessage('');

        try {
            const response = await axios.post(`${BASE_URL}/api/message`, {message, model : selectedModel, historyId : chatId});

            if (response.status === 200){
                console.log('Response : ', response)
                registerConversation(response.data.message, 'bot');
            }else {
                console.warn('Unexpected response structure:', response);
            }
        } catch (e) {
            console.error('Error from the backend : ', (e as any).message || e)
        } finally {
            setSubmitting(false);
            scrollToBottom(document.body.scrollHeight);
        }
    }

    
    return {
        message, submitting, handleInput, handleSubmitMessage, setMessage
    }
}

export default useMessage; 