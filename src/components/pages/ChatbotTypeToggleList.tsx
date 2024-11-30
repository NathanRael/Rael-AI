import {Stack} from "rael-ui"
import {ChatbotType} from "@/api/chatbotTypesApi.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import ChatbotTypeFeed from "@/components/pages/ChatbotTypeFeed.tsx";
import useChatType from "@/components/pages/useChatType.ts";

type ChatbotTypeListProps = {
    loading: boolean;
    error: Error;
    chatbotTypes: Omit<ChatbotType, 'context'>[];
    onRetry: () => void;
}
const ChatbotTypeToggleList = ({loading, error, chatbotTypes, onRetry}: ChatbotTypeListProps) => {
    const {selectedId, handleSelect} = useChatType();
    

    if (loading)
        return <LoaderUI title={'Fetching stuff'}/>;

    if (error)
        return <ErrorUI error={error} onRetry={onRetry}/>
    
    
    return (
        <Stack direction={'horizontal'} className={'items-start min-h-[180px] max-xl:flex-wrap max-md:visible visible'}
               gap={32}>
            {
                chatbotTypes?.slice(0, 3)?.map((chatbotType) => (
                    <ChatbotTypeFeed {...chatbotType}
                                     selected={selectedId === chatbotType.id}
                                     onClick={(id) => handleSelect(id)} key={chatbotType.id}/>
                ))
            }
        </Stack>
    )
}

export default ChatbotTypeToggleList