import {Stack, TextInput, Icon, Avatar, AvatarFallback, AvatarImage, cn, Card, useToast} from "rael-ui"
import {ArrowUp, Clipboard, Code, Code2, Copy} from "lucide-react";
import useMessage from "@/hooks/useMessage.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "@/constants";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dracula, dark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {copyToClipboard} from "@/utils/helpers.ts";

export type MessageFeedProps = {
    sender: 'user' | 'bot';
    message: string;
}

interface BackendMessages {
    "user_message": string;
    "bot_response": string;
}

const inputWidth  = 'w-full max-w-[680px]'

const Main = () => {
    const [conversations, setConversations] = useState<MessageFeedProps[]>([]);

    const registerConversation = (message: MessageFeedProps['message'], sender: MessageFeedProps['sender']): void => {
        setConversations(prev => [...prev, {message, sender}])
    }

    const fetchBackendMessages = async () => {
        const response = await axios.get(`${BASE_URL}/api/messages`);
        const backendMessages = response.data as BackendMessages[];

        setConversations(() =>
            backendMessages.flatMap((message): MessageFeedProps[] => [
                {message: message.user_message, sender: 'user'},
                {message: message.bot_response, sender: 'bot'}
            ]),
        );
    };


    useEffect(() => {
        fetchBackendMessages();
    }, []);

    return (
        <section className={'h-screen pt-[256px] px-4'}>
            <Stack direction={'vertical'} gap={40}>
                <Stack className={'w-full'} direction={'vertical'} gap={8}>
                    <h1 className={'text-[56px] text-center text-black  font-bold '}>Rael AI</h1>
                    <p className={'text-xl text-center text-gray-800 '}>Having some coding questions ? Well, let me know
                        .</p>
                </Stack>
                <Stack direction={'vertical'} className={`max-md:w-full pb-[128px] ${inputWidth}`} gap={24}>
                    {
                        conversations?.map((conversation, index) => (<MessageFeed key={index} {...conversation}/>))
                    }
                    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 ${inputWidth}`}>
                        <MainInput registerConversation={registerConversation}/>
                    </div>
                </Stack>
            </Stack>
        </section>
    )
}

const MainInput = ({registerConversation}: {
    registerConversation: (message: MessageFeedProps['message'], sender: MessageFeedProps['sender']) => void
}) => {
    const {handleInput, handleSubmit, message, submitting} = useMessage({registerConversation});

    return (
        <TextInput value={message} onChange={handleInput}
                   className={'w-full  shadow-md border border-gray-400 rounded-3xl text-lg font-bold'}
                   placeholder={'Your message ...'} size={'lg'}
                   rightContent={<Icon disabled={submitting} className={'rounded-2xl'} onClick={handleSubmit}><ArrowUp
                       size={16}/></Icon>}/>
    )
}

const MessageFeed = ({message, sender}: MessageFeedProps) => {
    const {toast, renderToastContainer} = useToast();
    const handleCopyToClipboard = (text : string) => {
        const cleanedText = text.trim();
        console.log('code', cleanedText);
        copyToClipboard(cleanedText, () => {
            toast({
                title: 'Copied!',
                message: 'Text copied',
                position: 'bottom-left',
                duration: 2000,
            })
        })
    }
    return (
        <Stack className={'w-full'} direction={'vertical'} align={'start'}>
            {renderToastContainer()}
            <div
                className={`w-fit py-3 px-4 flex justify-center gap-2 rounded-3xl text-base  ${sender === 'user' ? 'bg-primary/80 text-white items-center' : 'bg-input-fill-l-bg items-start'}`}>
                {
                    sender === 'user' &&
                    <div
                        className={`text-black text-[14px] font-bold min-w-10 min-h-10 size-10 flex  justify-center items-center rounded-full bg-white $`}>
                        {sender === 'user' ? 'You' : 'AI'}
                    </div>
                }
                {
                    sender === 'bot' &&
                    (
                        <div className={'prose'}>
                            <ReactMarkdown className={'text-wrap w-full'} children={message} components={{
                                code(props) {
                                    const {children, className, node, ...rest} = props
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeContent = String(children).replace(/\n$/, '');
                                    return match ? (
                                        <div className={'relative'}>
                                            <div className={'flex items-center gap-2 text-white text-base py-1 px-4  rounded-xl rounded-b-none w-fit'}>
                                                <Code2 size={16}/>
                                                <span>{className?.split('language-')[1]}</span>
                                            </div>
                                            <Icon onClick={() => handleCopyToClipboard(codeContent)} variant={'secondary'}
                                                  className={'absolute bottom-2 right-2 rounded-xl border border-gray-600'}><Copy
                                                size={16}/></Icon>
                                            <SyntaxHighlighter
                                                {...rest}
                                                PreTag="div"
                                                children={codeContent}
                                                language={match[1]}
                                                style={dracula}
                                                customStyle={{
                                                    maxWidth: '100%',
                                                    width: 'calc(60vw)',
                                                    overflowX: 'auto', // Allows horizontal scroll on small screens
                                                    borderRadius: ' 0 16px 16px',
                                                    padding: '16px',
                                                    margin : '0px',
                                                    fontSize : '14px',
                                                    backgroundColor : 'transparent',
                                                }}
                                            />
                                        </div>

                                    ) : (
                                        <code {...rest} className={className} >
                                            {children}
                                        </code>

                                    )
                                }
                            }} />
                        </div>
                    )
                }

                {
                    sender === 'user' && <span>{message}</span>
                }
            </div>
        </Stack>

    )
    
}

export default Main;