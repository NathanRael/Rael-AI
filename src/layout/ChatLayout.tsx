import {Navigate, Outlet, useParams} from "react-router-dom";
import useFetchConversations from "@/hooks/useFetchConversations.ts";
import {useEffect, useState} from "react";
import LoaderUI from "@/components/ui/LoaderUI.tsx";

const ChatLayout = () => {
    const {chatId} = useParams();
    const {data : conversations, isLoading : isLoadingConversation} = useFetchConversations({});
    const [conversationExist, setConversationExist] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        setLoading(true)
        if (conversations && !isLoadingConversation && chatId) {
            setConversationExist(conversations.some(conversation => conversation.id.toString() === chatId.toString()))
            setLoading(false)
        }
    }, [isLoadingConversation, chatId]);
    
    if (loading)
        return <LoaderUI className={'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}/>
    
    return (
       conversationExist ? <Outlet/> : <Navigate to={'/'}/>
    )
}

export default ChatLayout