import {Icon, Stack} from "rael-ui"
import {copyToClipboard} from "@/utils/helpers.ts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Code2, Copy} from "lucide-react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {dracula} from "react-syntax-highlighter/dist/esm/styles/prism";
import useWindowSize from "@/hooks/useWindowSize.ts";
import {Message} from "@/api/MessagesApi.ts";
import {useState} from "react";
import {downloadFile} from "@/api/fileApi.ts";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import ErrorUI from "@/components/ui/ErrorUI.tsx";


const MessageFeed = ({content, sender, file_id}: Omit<Message, 'id'>) => {
    const {data: image, isLoading: isFetchingImage, error: imageFetchError, refetch: reFetchImage} = useQuery({
        enabled: !!file_id,
        queryFn: () => downloadFile(file_id),
        queryKey: [queryKeys.downloadFile, {file_id}]
    })


    const handleCopyToClipboard = async (text: string) => {
        const cleanedText = text.trim();
        await copyToClipboard(cleanedText, () => {
        })
    }
    return (
        <Stack className={'w-full'} direction={'vertical'} align={'start'}>
            {file_id && <UserImageView image={image!} error={imageFetchError as Error} loading={isFetchingImage}
                                       reFetch={() => reFetchImage()}/>}
            <div
                className={`w-fit relative py-3 px-4 flex justify-center gap-2 rounded-3xl text-base  ${sender === 'user' ? 'bg-gradient-to-br from-primary to-primary/60 text-white items-center' : ' items-start'}`}>
                {
                    sender === 'user' &&
                    <div
                        className={`text-black text-[14px] font-bold min-w-10 min-h-10 size-10 flex  justify-center items-center rounded-full bg-white $`}>
                        You
                    </div>
                }
                {
                    sender === 'bot' &&
                    <BotMessage content={content} handleCopy={handleCopyToClipboard}/>
                }


                {
                    sender === 'user' &&
                    (
                        <UserMessage content={content} handleCopy={handleCopyToClipboard}/>
                    )
                }

            </div>
        </Stack>

    )

}


const UserMessage = ({content, handleCopy}: { content: string, handleCopy: (text: string) => Promise<void> }) => {
    return (
        <div className={'relative'}>
            <span>{content}</span>
            <CopyIcon className={'absolute -bottom-12 py-1 -left-16 '} onClick={() => handleCopy(content)}/>
        </div>

    )
}

const UserImageView = ({image, loading, error, reFetch}: {
    image: string,
    error: Error,
    reFetch: () => void,
    loading: boolean
}) => {

    if (error)
        return <ErrorUI error={error} onRetry={reFetch}/>

    if (loading)
        return <div className={'max-md:size-[128px] size-[210px] object-cover rounded-xl animate-pulse dark:bg-white/10 bg-black/20'}/>

    return (
        <img src={image} alt={'user Image'} className={'max-md:size-[128px] size-[210px]  object-cover rounded-xl'}/>
    )
}

const BotMessage = ({content, handleCopy}: { content: string, handleCopy: (text: string) => Promise<void> }) => {
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

    return (
        <div className={'prose prose-style relative'}>
            <CopyIcon className={'absolute -bottom-6 py-1 -left-2 '} onClick={() => handleCopy(content)}/>
            <ReactMarkdown className={'text-wrap w-full'} children={content} remarkPlugins={[remarkGfm]}
                           components={{
                               code(props : any) {
                                   // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                   const {children, className, node, ...rest} = props
                                   const match = /language-(\w+)/.exec(className || '')
                                   const codeContent = String(children).replace(/\n$/, '');
                                   return match ? (
                                       <div className={'relative'}>
                                           <div
                                               className={'flex items-center gap-2 text-white text-base py-1 px-4  rounded-xl rounded-b-none w-fit'}>
                                               <Code2 size={16}/>
                                               <span>{className?.split('language-')[1]}</span>
                                           </div>
                                           <CopyIcon forCode className={'absolute top-1 right-2'}
                                                     onClick={() => handleCopy(codeContent)}/>
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
                                           {codeContent}
                                       </code>

                                   )
                               }
                           }}
            />

        </div>
    )
}

const CopyIcon = ({
                      onClick = () => {
                      }, className, forCode
                  }: { onClick: () => void, className?: string, forCode?: boolean }) => {
    const [copied, setCopied] = useState(false);
    return (
        <Icon onClick={() => {
            setCopied(true);
            onClick()

            setTimeout(() => setCopied(false), 5000)
        }} className={className} variant={'ghost'} size={'sm'}>
            <Copy size={16}/>
            {!forCode && <span className={'text-[12px]'}>{copied ? 'copied' : 'copy'}</span>}
            {forCode && <span className={'text-[12px]'}>{copied ? 'code copied' : 'copy code'}</span>}
        </Icon>
    )
}

export default MessageFeed