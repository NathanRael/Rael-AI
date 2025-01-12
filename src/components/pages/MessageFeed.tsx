import {Icon, Stack} from "rael-ui";
import {copyToClipboard} from "@/utils/helpers.ts";
import {Code2, Copy} from "lucide-react";
import useWindowSize from "@/hooks/useWindowSize.ts";
import {Message} from "@/api/MessagesApi.ts";
import {useState} from "react";
import {downloadFile} from "@/api/fileApi.ts";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import markdownIt from "markdown-it";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prism-themes/themes/prism-dracula.css";

const code = [{
    content: '',
    language: '',
}]

const md: markdownIt = markdownIt({
    highlight: (str, lang) => {
        code.push({
            content: md.utils.escapeHtml(str),
            language: lang
        })
        if (lang && Prism.languages[lang]) {
            return `<pre class="language-${lang}" style="padding-top: 80px"><code class="language-${lang}">${Prism.highlight(
                str,
                Prism.languages[lang],
                lang
            )}</code></pre>`;
        }
        return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
});

const MessageFeed = ({content, sender, file_id}: Omit<Message, "id">) => {
    const {
        data: image,
        isLoading: isFetchingImage,
        error: imageFetchError,
        refetch: reFetchImage,
    } = useQuery({
        enabled: !!file_id,
        queryFn: () => downloadFile(file_id),
        queryKey: [queryKeys.downloadFile, {file_id}],
    });

    const handleCopyToClipboard = async (text: string) => {
        const cleanedText = text.trim();
        await copyToClipboard(cleanedText, () => {
        });
    };

    return (
        <Stack className="w-full" direction="vertical" align="start">
            {file_id && (
                <UserImageView
                    image={image!}
                    error={imageFetchError as Error}
                    loading={isFetchingImage}
                    reFetch={() => reFetchImage()}
                />
            )}
            <div
                className={`w-fit relative py-3 px-4 flex justify-center gap-2 rounded-3xl text-base ${
                    sender === "user"
                        ? "bg-gradient-to-br from-primary to-primary/60 text-white items-center"
                        : "items-start"
                }`}
            >
                {sender === "user" && (
                    <div
                        className="text-black text-[14px] font-bold min-w-10 min-h-10 size-10 flex justify-center items-center rounded-full bg-white">
                        You
                    </div>
                )}
                {sender === "bot" && (
                    <BotMessage content={content} handleCopy={handleCopyToClipboard}/>
                )}
                {sender === "user" && (
                    <UserMessage content={content} handleCopy={handleCopyToClipboard}/>
                )}
            </div>
        </Stack>
    );
};

const UserMessage = ({
                         content,
                         handleCopy,
                     }: {
    content: string;
    handleCopy: (text: string) => Promise<void>;
}) => {
    return (
        <div className="relative">
            <span>{content}</span>
            <CopyIcon
                className="absolute -bottom-12 py-1 -left-16"
                onClick={() => handleCopy(content)}
            />
        </div>
    );
};

const UserImageView = ({
                           image,
                           loading,
                           error,
                           reFetch,
                       }: {
    image: string;
    error: Error;
    reFetch: () => void;
    loading: boolean;
}) => {
    if (error)
        return <ErrorUI error={error} onRetry={reFetch}/>;

    if (loading)
        return (
            <div
                className="max-md:size-[128px] size-[210px] object-cover rounded-xl animate-pulse dark:bg-white/10 bg-black/20"/>
        );

    return (
        <img
            src={image}
            alt="user Image"
            className="max-md:size-[128px] size-[210px] object-cover rounded-xl"
        />
    );
};

const BotMessage = ({
                        content,
                        handleCopy,
                    }: {
    content: string;
    handleCopy: (text: string) => Promise<void>;
}) => {
    const {width} = useWindowSize();
    const parsedContent = md.render(content); // Render content with Prism.js highlighting.

    const generateWidth = () => {
        if (width >= 668) return "auto";
        if (width > 540) return "80vw";
        if (width > 400) return "75vw";
        if (width > 300) return "70vw";
    };



    return (
        <div className="prose prose-style relative">
            <CopyIcon className={'absolute -bottom-6 py-1 -left-2 '} onClick={() => handleCopy(content)}/>
            {
                parsedContent && code.length > 0 && (
                    <>
                        {
                            code?.map((c) => (
                               c.content && (
                                   <div className={'absolute top-[136px] w-full'}>
                                       <div
                                           className={'flex items-center gap-2 text-white text-base py-1 px-4  rounded-xl rounded-b-none w-fit'}>
                                           <Code2 size={16}/>
                                           <span>{c.language}</span>
                                       </div>
                                       <CopyIcon forCode className={'absolute top-1 right-2'}
                                                 onClick={() => handleCopy(c.content)}/>
                                   </div>
                               ) 
                            ))
                        }
                        <article
                            style={{width: generateWidth()}}
                            dangerouslySetInnerHTML={{
                                __html: parsedContent
                            }}
                        />
                    </>
                )
            }
        </div>
    )
        ;
};


const CopyIcon = ({
                      onClick = () => {
                      },
                      className,
                      forCode,
                  }: {
    onClick: () => void;
    className?: string;
    forCode?: boolean;
}) => {
    const [copied, setCopied] = useState(false);
    return (
        <Icon
            onClick={() => {
                setCopied(true);
                onClick();

                setTimeout(() => setCopied(false), 5000);
            }}
            className={className}
            variant="ghost"
            size="sm"
        >
            <Copy size={16}/>
            {!forCode && (
                <span className="text-[12px]">{copied ? "copied" : "copy"}</span>
            )}
            {forCode && (
                <span className="text-[12px]">
          {copied ? "code copied" : "copy code"}
        </span>
            )}
        </Icon>
    );
};

export default MessageFeed;
