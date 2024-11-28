import {useMemo} from "react";
import {useToast} from "rael-ui"
import useScroll from "@/hooks/useScroll.ts";
import {newMessage} from "@/api/MessagesApi.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";

type UseMessageProps = {
    selectedModel: string;
}


const useMessages = ({selectedModel}: UseMessageProps) => {
    const {toast} = useToast();
    const {scrollToBottom} = useScroll();
    const queryClient = useQueryClient();
    
    const {mutateAsync: newMessageMutation, isLoading: submitting, variables} = useMutation({
        mutationFn: newMessage,
        onSuccess : () => {
            queryClient.invalidateQueries([queryKeys.chat]);
            queryClient.invalidateQueries([queryKeys.conversationList]);
        },
    })
    
    const optimisticMessage = useMemo(() => variables?.content, [variables?.content])

    
    const handleSubmitMessage = async (inputValue: string, conversationId: string, onValidInput : () => void, chatbotTypeId : string) => {
        
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
        
        try {
         await newMessageMutation({
             conversation_id : conversationId,
             content : inputValue,
             model : selectedModel,
             chatbot_type_id : chatbotTypeId,
         })
        } catch (e) {
            console.error(e)
        }finally {
            scrollToBottom(document.body.scrollHeight)
        }
        
    }


    return {
         submitting, handleSubmitMessage, optimisticMessage
    }
}

export default useMessages;

