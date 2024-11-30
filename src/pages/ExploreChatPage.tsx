import {ChevronLeft} from "lucide-react";
import {Icon} from "rael-ui"
import ChatbotTyeListFilter from "@/components/pages/ChatbotTyeListFilter.tsx";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchChatbotTypes} from "@/api/chatbotTypesApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import ExploreChatbotTypeList from "@/components/pages/ExploreChatbotTypeList.tsx";
import {useState} from "react";

const ExploreChatPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const {data : chatBotTypes, isLoading : isFetchingChatbotType, error : chatbotTypeError} = useQuery({
        queryFn : () => fetchChatbotTypes({search}),
        queryKey : [queryKeys.chatbotTypeList, {search}],
    });
    return (
        <section className="p-4 space-y-10">
            <Icon onClick={() => navigate('/')} size={'sm'} variant={'ghost'}>
                <ChevronLeft size={32}/>
            </Icon>
            <div className={'mx-auto w-fit text-center'}>
                <h1 className={'text-[32px] text-black dark:text-white font-bold'}>
                    <span>Chatbot types</span>
                </h1>
                <p className={'text-black/80 dark:text-white/80 text-lead'}>Find chatbot that matches your need </p>
            </div>
            <div className={'flex-centered'}>
                <ChatbotTyeListFilter onChange={setSearch} className={'w-[50%] max-md:w-[90%]'}/>
            </div>
            <ExploreChatbotTypeList loading={isFetchingChatbotType} error={chatbotTypeError as Error} chatbotTypes={chatBotTypes!} onRetry={() => {}}/>
        </section>
    )
}

export default ExploreChatPage

