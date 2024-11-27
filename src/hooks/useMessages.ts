import {useMemo} from "react";
import * as React from "react";
import {useToast} from "rael-ui"
import useScroll from "@/hooks/useScroll.ts";
import {newMessage} from "@/api/MessagesApi.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";

type UseMessageProps = {
    selectedModel: string;
}


const useMessages = ({selectedModel}: UseMessageProps) => {
    // const [submitting, setSubmitting] = useState(false);
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

    
    const handleSubmitMessage = async (inputValue: string, conversationId: string, setInputValue: React.Dispatch<React.SetStateAction<string>>) => {

        // -TODO : Sending api request
        if (inputValue === '' || !inputValue)
            return
        
        if (selectedModel === '') {
            toast({
                title: 'Error',
                message: 'Please select a model',
            })
            return console.error('Please select a model')
        }
        setInputValue('');
        
        try {
         await newMessageMutation({
             conversation_id : conversationId,
             content : inputValue,
             model : selectedModel
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

