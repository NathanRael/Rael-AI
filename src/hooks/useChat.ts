
import {MessageFeedProps} from "@/components/pages/MessageFeed.tsx";
import useFetchConversations from "@/hooks/useFetchConversations.ts";

const useChat = () => {
    const {conversations, setConversations, loading, error, fetchConversations} = useFetchConversations();
    
    const registerConversation = (message: MessageFeedProps['message'], sender: MessageFeedProps['sender']): void => {
        setConversations(prev => [...prev, {message, sender}])
    }
    
    return {registerConversation, loading, error, conversations, fetchConversations};
}

export default useChat;