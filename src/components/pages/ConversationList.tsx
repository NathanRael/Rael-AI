import ChatHistory from "@/components/pages/ChatHistory.tsx";
import {Stack} from "rael-ui";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import {Conversation} from "@/api/conversationsApi.ts";

type HistoryListProps = {
    conversations: Conversation[];
    loading: boolean;
    error: { message : string };
}
const ConversationList = ({conversations, loading, error}: HistoryListProps) => {

    if (loading) 
        return <LoaderUI title={'Fetching conversation'} />;
    
    if (error)
        return <p className={'text-danger text-sm'}>{error?.message}</p>
    
    return (
        <Stack className={'w-full'} gap={8}>
            {conversations.length === 0 && <p>No conversation yet</p>}
            {
                conversations?.map((conversation) => (
                    <ChatHistory id={conversation.id} name={conversation.title}
                                 key={conversation.id}/>))
            }
        </Stack>
    )
}

export default ConversationList