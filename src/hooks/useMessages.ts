import {useState} from "react";
import {useToast} from "rael-ui"
import useScroll from "@/hooks/useScroll.ts";
import {createMessage, newStreamedMessage} from "@/api/MessagesApi.ts";
import {useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import {useModelStore} from "@/store/useModelStore.ts";



const useMessages = () => {
    const {toast} = useToast();
    const {scrollToBottom} = useScroll();
    const queryClient = useQueryClient();
    const selectedModel = useModelStore(state => state.selectedModel);
    
    
    const [submitting, setSubmitting] = useState(false);
    const [streamedMessage, setStreamedMessage] = useState('');
    const [optimisticMessage, setOptimisticMessage] = useState('');
    

    const handleSubmitMessage = async (inputValue: string, conversationId: string, onValidInput: () => void, chatbotTypeId: string, fileId?: string) => {

        if (inputValue === '' || !inputValue)
            return

        if (selectedModel === '') {
            toast({
                title: 'Error',
                message: 'Please select a model',
            })
            return console.error('Please select a model')
        }
        onValidInput();
        
        setSubmitting(true);
        setOptimisticMessage(inputValue);
        try {
            
            await newStreamedMessage({
                
                conversation_id: conversationId,
                content: inputValue,
                model: selectedModel,
                chatbot_type_id: chatbotTypeId,
                file_id : fileId,
                
                onChange: (v) => setStreamedMessage(prevState => prevState + v),
                onFinish: async (fullMessage) => {
                    setSubmitting(false)
                    // Saving the chatbot message in the db
                    
                    await createMessage({
                        content : fullMessage,
                        conversation_id: conversationId,
                        model: selectedModel,
                        chatbot_type_id: chatbotTypeId,
                        sender : 'bot'
                    })
                    
                    setStreamedMessage('');
                    setOptimisticMessage('');
                    
                    await queryClient.invalidateQueries([queryKeys.chat]);
                    await queryClient.invalidateQueries([queryKeys.conversationList]);
                    

                }
            })
            
        } catch (e) {
            console.error(e)
        } finally {
            scrollToBottom(document.body.scrollHeight)
            setSubmitting(false)
        }

    }


    return {
        submitting, handleSubmitMessage, optimisticMessage,streamedMessage
    }
}

export default useMessages;

