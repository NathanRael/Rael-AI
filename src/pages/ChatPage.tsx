import useScroll from "@/hooks/useScroll.ts";
import {useEffect, useRef} from "react";
import useInView from "@/hooks/useInView.ts";
import {INPUT_WIDTH} from "@/constants/style.ts";
import ChatInput from "@/components/pages/ChatInput.tsx";
import {ArrowDown, LoaderCircle} from "lucide-react";
import {cn, Icon, Stack} from "rael-ui";
import {useParams} from "react-router-dom";
import MessageList from "@/components/pages/MessageList.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchMessages} from "@/api/MessagesApi.ts";
import MessageContent from "@/components/pages/MessageContent.tsx";
import {queryKeys} from "@/api/queryKeys.ts";
import {fetchChatbotType} from "@/api/chatbotTypesApi.ts";
import ChatbotTypeCard from "@/components/pages/ChatbotTypeCard.tsx";
import {useMessageStore} from "@/store/messageStore.ts";

const ChatPage = () => {
    const {chatId} = useParams();
    const submitting = useMessageStore(state => state.submitting);
    const optimisticMessage = useMessageStore(state => state.optimisticMessage);
    const streamedMessage = useMessageStore(state => state.streamedMessage);
    const fileId = useMessageStore(state => state.fileId);


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

    useEffect(() => {
        handleScrollToBottom()
    }, [chatId])


    return (
        <section ref={ref} className={'h-full  pt-[256px] px-4 overflow-y-hidden'}>
            <Stack direction={'vertical'} className={' pb-[160px]'} gap={40}>
                <Stack className={` h-fit ${INPUT_WIDTH} space-y-6`} align={'start'}>
                    <MessageList messages={messages!} error={error as Error} loading={isLoading}/>
                    {submitting &&
                        (
                            <>
                                <Stack className={`max-md:w-full ${INPUT_WIDTH}`}>
                                    <MessageContent 
                                        file_id={fileId} 
                                        sender={'user'} 
                                        content={optimisticMessage!}
                                    />
                                </Stack>
                                <Stack className={`max-md:w-full ${INPUT_WIDTH}`}>
                                    <MessageContent
                                        sender={'bot'}
                                        streamed
                                        streamedMessage={streamedMessage}
                                        content={''}
                                        file_id={''}
                                    />
                                </Stack>
                                <MessageLoader/>
                            </>
                        )
                    }

                </Stack>
                {
                    (!isFetchingChatbotType && !isLoading && !submitting) && (
                        <Stack className={`min-h-[180px] ${INPUT_WIDTH}`}>
                            <ChatbotTypeCard className={'cursor-default'}  {...chatbotType!} selected={false}/>
                        </Stack>
                    )

                }
                <div
                    className={cn(`fixed bottom-10 max-md:bottom-2 left-1/2 -translate-x-1/2  ${INPUT_WIDTH}`, 'max-md:w-[96%]')}>
                    <ChatInput/>
                </div>
                <div ref={containerRef}/>

            </Stack>

            <Icon onClick={() => handleScrollToBottom()}
                  className={cn('rounded-2xl fixed bottom-[132px] max-md:bottom-[96px] left-1/2 -translate-x-1/2 transition', !arrowDownInView ? 'opacity-1 scale-1' : 'opacity-0 scale-0')}>
                <ArrowDown size={16}/>
            </Icon>
        </section>
    )
}

const MessageLoader = () => {
    return (
        <div className={'flex items-center justify-center gap-2'}>
            <LoaderCircle className={'animate-spin text-black dark:text-white'} size={20}/>
            <p className={'animate-pulse text-black dark:text-white'}>Generating response</p>
        </div>
    )
}

export default ChatPage;