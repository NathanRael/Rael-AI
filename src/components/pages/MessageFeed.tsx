import {Stack, Icon, useToast} from "rael-ui"
import {copyToClipboard} from "@/utils/helpers.ts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Code2, Copy} from "lucide-react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {dracula} from "react-syntax-highlighter/dist/esm/styles/prism";
import useWindowSize from "@/hooks/useWindowSize.ts";
import {useRef} from "react";

export type MessageFeedProps = {
    sender: 'user' | 'bot';
    message: string;
}
const MessageFeed = ({message, sender}: MessageFeedProps) => {
    const {toast, renderToastContainer} = useToast();
    const stackRef = useRef<HTMLDivElement>(null);

    const {width} = useWindowSize();
    
    
    const generateWidth = () => {
        if (width >= 668)
            return 'auto'
        if (width > 540)
            return '80vw'
        if (width > 400)
            return '75vw'
        if (width > 300)
            return '70vw'

    }
    const handleCopyToClipboard = async (text: string) => {
        const cleanedText = text.trim();
        await copyToClipboard(cleanedText, () => {
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
                className={`w-fit py-3 px-4 flex justify-center gap-2 rounded-3xl text-base  ${sender === 'user' ? 'bg-gradient-to-br from-primary to-primary/60 text-white items-center' : ' items-start'}`}>
                {
                    sender === 'user' &&
                    <div
                        className={`text-black text-[14px] font-bold min-w-10 min-h-10 size-10 flex  justify-center items-center rounded-full bg-white $`}>
                        You
                    </div>
                }
                {
                    sender === 'bot' &&
                    (
                        <div className={'prose prose-code: dark:prose-invert'}>
                            <ReactMarkdown className={'text-wrap w-full'} children={message} remarkPlugins={[remarkGfm]}
                                           components={{
                                               code(props) {
                                                   const {children, className, node, ...rest} = props
                                                   const match = /language-(\w+)/.exec(className || '');
                                                   const codeContent = String(children).replace(/\n$/, '');
                                                   return match ? (
                                                       <div className={'relative'}>
                                                           <div
                                                               className={'flex items-center gap-2 text-white text-base py-1 px-4  rounded-xl rounded-b-none w-fit'}>
                                                               <Code2 size={16}/>
                                                               <span>{className?.split('language-')[1]}</span>
                                                           </div>
                                                           <Icon onClick={() => handleCopyToClipboard(codeContent)}
                                                                 variant={'secondary'}
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
                                                                   width: generateWidth(),
                                                                   overflowX: 'auto', // Allows horizontal scroll on small screens
                                                                   borderRadius: ' 0 16px 16px',
                                                                   padding: '16px',
                                                                   margin: '0px',
                                                                   fontSize: '14px',
                                                                   backgroundColor: 'transparent',
                                                               }}
                                                           />
                                                       </div>

                                                   ) : (
                                                       <code {...rest} className={className}>
                                                           {children}
                                                       </code>

                                                   )
                                               }
                                           }}/>
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

export default MessageFeed