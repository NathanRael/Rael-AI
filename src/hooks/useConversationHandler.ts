import useFetchConversations from "@/hooks/useFetchConversations.ts";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {newConversation} from "@/api/conversationsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useState} from "react";

export const useConversationHandler = ({queryClient} : {queryClient : QueryClient}) => {
    const [newConversationCreated, setNewConversationCreated] = useState(false);
    const {data: conversations, isLoading: isConversationLoading} = useFetchConversations({});
    
    const {mutateAsync: newConversationMutation} = useMutation({
        mutationFn: newConversation,
        onSuccess: async () => {
            await queryClient.invalidateQueries([queryKeys.conversationList]);
            setNewConversationCreated(true)
        },
    });
    
    const createNewConversation = async ({userId, chatbotTypeId, title}: {userId: string, title: string, chatbotTypeId: string}) => {
        await newConversationMutation({
            user_id: userId,
            title,
            chatbot_type_id: chatbotTypeId,
        });
    };
    
    return {createNewConversation, conversations, isConversationLoading, newConversationCreated}
}