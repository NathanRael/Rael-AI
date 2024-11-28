import {useMessageContext} from "@/context/MessageProvider.tsx";
import useScroll from "@/hooks/useScroll.ts";
import {useEffect, useRef, useState} from "react";
import useInView from "@/hooks/useInView.ts";
import {INPUT_WIDTH} from "@/constants/style.ts";
import ChatInput from "@/components/pages/ChatInput.tsx";
import {ArrowDown, Bot} from "lucide-react";
import {Badge, cn, Icon, Stack} from "rael-ui";
import {useParams} from "react-router-dom";
import MessageList from "@/components/pages/MessageList.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchMessages} from "@/api/MessagesApi.ts";
import MessageFeed from "@/components/pages/MessageFeed.tsx";
import {queryKeys} from "@/api/queryKeys.ts";
import {fetchChatbotType} from "@/api/chatbotTypesApi.ts";
import ChatbotTypeFeed from "@/components/pages/ChatbotTypeFeed.tsx";

const ChatPage = () => {
    const {chatId} = useParams();
    const {submitting, optimisticMessage} = useMessageContext();
    const {scrollToBottom} = useScroll();
    const ref = useRef<HTMLDivElement>(null);
    const {inView: arrowDownInView, containerRef} = useInView({});

    const {
        data: messages,
        error,
        isLoading,
    } = useQuery({
        enabled: !!chatId,
        queryFn: () => fetchMessages(chatId!),
        queryKey: [queryKeys.chat, {chatId}],
    })

    const {data: chatbotType, isLoading: isFetchingChatbotType} = useQuery({
        enabled: !!chatId,
        queryFn: () => fetchChatbotType({conversationId: chatId}),
        queryKey: [queryKeys.chatbotType]
    })

    const handleScrollToBottom = () => {
        if (!ref.current) return;
        scrollToBottom(ref.current.scrollHeight)
    }


    return (
        <section ref={ref} className={'h-full  pt-[256px] px-4 overflow-y-hidden'}>
            {/*<Badge size={'md'} className={'fixed bg-secondary border-secondary flex items-center flex-row top-6 text-base left-1/2 -translate-x-1/2'}> <Bot size={16}/> {chatbotType?.name}</Badge>*/}
            <Stack direction={'vertical'} className={' pb-[160px]'} gap={40}>
                <Stack className={` h-fit ${INPUT_WIDTH}`} align={'start'}>
                    <MessageList messages={messages!} error={error as any} loading={isLoading}/>
                    {submitting && <Stack className={`max-md:w-full ${INPUT_WIDTH}`}> <MessageFeed sender={'user'} content={optimisticMessage!}/></Stack>}
                    {submitting && <MessageLoader/>}
                </Stack>
                {
                    (!isFetchingChatbotType && !isLoading && !submitting) && (
                        <Stack className={`min-h-[180px] ${INPUT_WIDTH}`}>
                            <ChatbotTypeFeed className={'cursor-default'}  {...chatbotType!} selected={false}/>
                        </Stack>
                    )
                   
                }
                <div className={cn(`fixed bottom-10 left-1/2 -translate-x-1/2  ${INPUT_WIDTH}`, 'max-md:w-[96%]')}>
                    <ChatInput/>
                </div>

            </Stack>
            <Icon onClick={() => handleScrollToBottom()}
                  className={cn('rounded-2xl fixed bottom-[132px] left-1/2 -translate-x-1/2 transition', !arrowDownInView ? 'opacity-1 scale-1' : 'opacity-0 scale-0')}>
                <ArrowDown size={16}/>
            </Icon>
            <div ref={containerRef}/>
        </section>
    )
}

const MessageLoader = () => {
    const LOADING_TEXTS = [
        "Getting things ready",
        "Almost there",
        "Generating answer",
        "Hold on a minute"
    ]
    const [loadingMessage, setLoadingMessage] = useState("Getting things ready");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIndex(prev => (prev + 1) % LOADING_TEXTS.length);
            setLoadingMessage(LOADING_TEXTS[index]);
        }, 8000)

        return () => clearTimeout(timeoutId)
    }, [loadingMessage, index])
    return (
        <p className={'animate-pulse text-black dark:text-white'}>{loadingMessage}</p>
    )
}

export default ChatPage;