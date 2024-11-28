import {Stack} from "rael-ui"
import {ChatbotType} from "@/api/chatbotTypesApi.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import ChatbotTypeFeed from "@/components/pages/ChatbotTypeFeed.tsx";
import {useState} from "react";
import {useSearchParams} from "react-router-dom";

type ChatbotTypeListProps = {
    loading: boolean;
    error: Error;
    chatbotTypes: Omit<ChatbotType, 'context'>[];
    onRetry: () => void;
}
const ChatbotTypeList = ({loading, error, chatbotTypes, onRetry}: ChatbotTypeListProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedId, setSelectedId] = useState<number | string>(searchParams.get('chatType') || 0);
    const updateQueryParam = (paramKey: string, newParamValue: string) => {
        setSearchParams({[paramKey]: newParamValue});
    };
    const handleSelect = ( id: string) => {
        updateQueryParam('chatType', id)
        setSelectedId(id)
    }

    const getSelectedChat = (index: number, id: string): boolean => {
        if (typeof selectedId === "number")
            return selectedId === index
        return selectedId === id
    }
    

    if (loading)
        return <LoaderUI title={'Fetching stuff'}/>;

    if (error)
        return <ErrorUI error={error} onRetry={onRetry}/>
    
    
    return (
        <Stack direction={'horizontal'} className={'items-start min-h-[180px] max-xl:flex-wrap max-md:visible visible'}
               gap={32}>
            {
                chatbotTypes?.slice(0, 3)?.map((chatbotType, index) => (
                    <ChatbotTypeFeed {...chatbotType}
                                     selected={getSelectedChat(index, chatbotType.id)}
                                     onClick={(id) => handleSelect(id)} key={chatbotType.id}/>
                ))
            }
        </Stack>
    )
}

export default ChatbotTypeList