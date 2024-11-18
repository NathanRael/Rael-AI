import {useChatContext} from "@/context/ChatProvider.tsx";
import {useMessageContext} from "@/context/MessageProvider.tsx";
import useScroll from "@/hooks/useScroll.ts";
import {useEffect, useRef, useState} from "react";
import useInView from "@/hooks/useInView.ts";
import ModelSwitcher from "@/components/pages/ModelSwitcher.tsx";
import ThemeSwitcher from "@/components/pages/ThemeSwitcher.tsx";
import MessageList from "@/components/pages/MessageList.tsx";
import {INPUT_WIDTH} from "@/constants/style.ts";
import ChatInput from "@/components/pages/ChatInput.tsx";
import {ArrowDown} from "lucide-react";
import {cn, Icon, Stack } from "rael-ui";
import {useParams} from "react-router-dom";

const ChatPage = () => {
    const {chatId} = useParams();
    const {conversations, loading, error, fetchConversations} = useChatContext();
    const {submitting} = useMessageContext();
    const {scrollToBottom} = useScroll();
    const ref = useRef<HTMLDivElement>(null);
    const {inView: arrowDownInView, containerRef} = useInView({});

    const handleScrollToBottom = () => {
        if (!ref.current || loading) return;
        scrollToBottom(ref.current.scrollHeight)
    }
    
    useEffect(() => {
        fetchConversations(chatId!)
    }, [chatId])

/*    useEffect(() => {
        // handleScrollToBottom()
    }, [loading, submitting]);*/

    return (
        <section ref={ref} className={'h-full  pt-[256px] px-4 overflow-y-hidden'}>
            <Stack>
                <ModelSwitcher/>
                <ThemeSwitcher className={'pb-10'}/>
            </Stack>
            <Stack direction={'vertical'} gap={40}>
                <Stack className={'w-full'} direction={'vertical'} gap={8}>
                    <h1 className={'text-[56px] text-center text-black  font-bold dark:text-white'}>Rael AI</h1>
                    <p className={'text-xl text-center text-gray-800 dark:text-gray-400 '}>Having some coding questions ? Well, let me know .</p>
                </Stack>
                <Stack className={'pb-[128px]'} align={'start'}>
                    <MessageList loading={loading} error={error} conversations={conversations}/>
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