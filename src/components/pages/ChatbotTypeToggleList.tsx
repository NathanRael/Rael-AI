import {Stack} from "rael-ui"
import {ChatbotType} from "@/api/chatbotTypesApi.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import ChatbotTypeCard from "@/components/pages/ChatbotTypeCard.tsx";
import useChatType from "@/components/pages/useChatType.ts";

type ChatbotTypeListProps = {
    loading: boolean;
    error: Error;
    chatbotTypes: Omit<ChatbotType, 'context'>[];
    onRetry: () => void;
}
const ChatbotTypeToggleList = ({loading, error, chatbotTypes, onRetry}: ChatbotTypeListProps) => {
    const {selectedId, handleSelect} = useChatType();
    

    if (loading )
        return <LoaderUI title={'Fetching stuff'}/>;

    if (error)
        return <ErrorUI error={error} onRetry={onRetry}/>
    
    
    
    
    return (
        <Stack direction={'horizontal'} className={'items-start h-fit  max-xl:flex-wrap justify-center  '}
               gap={24}>
            {
                chatbotTypes?.slice(0, 3)?.map((chatbotType) => (
                    <ChatbotTypeCard className={'max-sm:w-full'} {...chatbotType}
                                     selected={selectedId === chatbotType.id}
                                     onClick={(id) => selectedId !== chatbotType.id &&handleSelect(id)} key={chatbotType.id}/>
                ))
            }
        </Stack>
    )
}

export default ChatbotTypeToggleList