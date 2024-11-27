import {useMessageContext} from "@/context/MessageProvider.tsx";
import useScroll from "@/hooks/useScroll.ts";
import {useEffect, useRef, useState} from "react";
import useInView from "@/hooks/useInView.ts";
import {INPUT_WIDTH} from "@/constants/style.ts";
import ChatInput from "@/components/pages/ChatInput.tsx";
import {ArrowDown} from "lucide-react";
import {cn, Icon, Stack } from "rael-ui";
import {useParams} from "react-router-dom";
import MessageList from "@/components/pages/MessageList.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchMessages} from "@/api/MessagesApi.ts";
import MessageFeed from "@/components/pages/MessageFeed.tsx";
import {queryKeys} from "@/api/queryKeys.ts";

const ChatPage = () => {
    const {chatId} = useParams();
    const {submitting, optimisticMessage} = useMessageContext();
    const {scrollToBottom} = useScroll();
    const ref = useRef<HTMLDivElement>(null);
    const {inView: arrowDownInView, containerRef} = useInView({});
    
    const {
        data : messages,
        error,
        isLoading,
    } =  useQuery({
        enabled : !!chatId,
        queryFn : () => fetchMessages(chatId!),
        queryKey : [queryKeys.chat, {chatId}],
    })
    
    const handleScrollToBottom = () => {
        if (!ref.current) return;
        scrollToBottom(ref.current.scrollHeight)
    }
    
    useEffect(
        () => {
            console.log('optMessage', optimisticMessage)
        }
    , [optimisticMessage])
    
    
    return (
        <section ref={ref} className={'h-full  pt-[256px] px-4 overflow-y-hidden'}>
            {/*<ModelSwitcher className={'fixed left-14 top-2'} />*/}
          
            <Stack direction={'vertical'} gap={40}>
                <Stack className={'w-full'} direction={'vertical'} gap={8}>
                    <h1 className={'text-[56px] text-center text-black  font-bold dark:text-white'}>Rael AI</h1>
                    <p className={'text-xl text-center text-gray-800 dark:text-gray-400 '}>Having some coding questions ? Well, let me know .</p>
                </Stack>
                <Stack className={`pb-[128px] ${INPUT_WIDTH}`} align={'start'}>
                    <MessageList messages={messages!} error={error as any} loading={isLoading}/>
                    {submitting &&<Stack className={`max-md:w-full ${INPUT_WIDTH}`}> <MessageFeed sender={'user'} content={optimisticMessage!}/></Stack>}
                    {submitting && <MessageLoader/>}
                </Stack>
                <div className={cn(`fixed bottom-10 left-1/2 -translate-x-1/2  ${INPUT_WIDTH}`, 'max-md:w-[96%]')}>
                    <ChatInput/>
                </div>
            </Stack>
            <Icon onClick={() => handleScrollToBottom()}
                  className={cn('rounded-2xl fixed bottom-[108px] left-1/2 -translate-x-1/2 transition', !arrowDownInView ? 'opacity-1 scale-1' : 'opacity-0 scale-0')}>
                <ArrowDown size={16}/>
            </Icon>
            {/* Arrow down icon ref */}
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