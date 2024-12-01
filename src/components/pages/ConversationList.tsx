import ChatHistory from "@/components/pages/ChatHistory.tsx";
import {Stack, cn} from "rael-ui";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import {Conversation} from "@/api/conversationsApi.ts";
import {useParams} from "react-router-dom";

type HistoryListProps = {
    conversations: Conversation[];
    loading: boolean;
    error: { message : string };
    className? : string;
    
}
const ConversationList = ({conversations, loading, error, className}: HistoryListProps) => {
    const {chatId} = useParams();
    if (loading) 
        return <LoaderUI title={'Fetching conversation'} />;
    
    if (error)
        return <p className={'text-danger text-sm'}>{error?.message}</p>
    
    
    return (
        <Stack className={cn('w-full justify-start', className)}  gap={8}>
            {conversations.length === 0 && <p className={'text-meta-fill-l-text dark:text-meta-fill-d-text'}>No conversation found</p>}
            {
                conversations?.map((conversation) => (
                    <ChatHistory id={conversation.id} name={conversation.title}
                                 key={conversation.id} active={conversation.id === chatId}/>))
            }
        </Stack>
    )
}

export default ConversationList