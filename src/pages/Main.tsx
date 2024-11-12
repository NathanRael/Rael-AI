import {Stack, Icon, Textarea, cn} from "rael-ui"
import {ArrowDown, ArrowUp, Code2} from "lucide-react";
import {INPUT_WIDTH} from "@/constants/style.ts";
import MessageList from "@/components/pages/MessageList.tsx";
import {useMessageContext} from "@/context/MessageProvider.tsx";
import {useChatContext} from "@/context/ChatProvider.tsx";
import useSmartTextarea from "@/hooks/useSmartTextarea.ts";
import {useEffect, useRef, useState} from "react";
import useScroll from "@/hooks/useScroll.ts";
import useInView from "@/hooks/useInView.ts";
import ThemeSwitcher from "@/components/pages/ThemeSwitcher.tsx";


const Main = () => {
    const {conversations, loading, error} = useChatContext();
    const {submitting} = useMessageContext();
    const {scrollToBottom} = useScroll();
    const ref = useRef<HTMLDivElement>(null);
    const {inView: arrowDownInView, containerRef} = useInView({});

    const handleScrollToBottom = () => {
        if (!ref.current || loading) return;
        scrollToBottom(ref.current.scrollHeight)
    }


    useEffect(() => {
        handleScrollToBottom()
    }, [loading, submitting]);

    return (
        <section ref={ref} className={'h-full  pt-[256px] px-4 overflow-y-scroll'}>
            <ThemeSwitcher  className={'pb-10'}/>
            <Icon onClick={() => handleScrollToBottom()}
                  className={cn('rounded-2xl fixed bottom-[108px] left-1/2 -translate-x-1/2 transition', !arrowDownInView ? 'opacity-1 scale-1' : 'opacity-0 scale-0')}>
                <ArrowDown size={16}/>
            </Icon>
            <Stack direction={'vertical'} gap={40}>
                <Stack className={'w-full'} direction={'vertical'} gap={8}>
                    <h1 className={'text-[56px] text-center text-black  font-bold dark:text-white'}>Rael AI</h1>
                    <p className={'text-xl text-center text-gray-800 dark:text-gray-400 '}>Having some coding questions ? Well, let me know
                        .</p>
                </Stack>
                <Stack className={'pb-[128px]'} align={'start'}>
                    <MessageList loading={loading} error={error} conversations={conversations}/>
                    {submitting && <InputLoader/>}
                </Stack>
                <div className={cn(`fixed bottom-10 left-1/2 -translate-x-1/2  ${INPUT_WIDTH}`, 'max-md:w-[96%]')}>
                    <MainInput/>
                </div>
            </Stack>
            <div ref={containerRef}/>
        </section>
    )
}

const MainInput = () => {
    const {handleInput, handleSubmitMessage, message, setMessage, submitting} = useMessageContext();
    const {scrollToBottom} = useScroll();

    const {rows, handleKeyPress} = useSmartTextarea({
        onShiftAndEnter: () => setMessage(prev => prev + '\n'),
        onEnter: () => {
            handleSubmitMessage()
            scrollToBottom(document.body.scrollHeight);
        },
        value: message
    });

    return (
        <Textarea value={message}
                  rows={rows}
                  onKeyDown={(e) => handleKeyPress(e as unknown as KeyboardEvent)}
                  onChange={handleInput}
                  className={`w-full shadow-md  border border-gray-400 dark:border-neutral-700 rounded-3xl text-lg   min-h-[32px] h-fit resize-none ${rows === 1 ? 'items-center' : 'items-end'} `}
                  placeholder={'Your message ...'} size={'md'}
                  rightContent={<Icon role={'button'} type={'submit'} disabled={submitting} className={'rounded-2xl'}
                                      onClick={handleSubmitMessage}><ArrowUp
                      size={16}/></Icon>}
        />
    )
}

const InputLoader = () => {
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


export default Main;