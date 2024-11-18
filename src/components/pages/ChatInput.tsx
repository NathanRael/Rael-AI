import {useChatContext} from "@/context/ChatProvider.tsx";
import {useMessageContext} from "@/context/MessageProvider.tsx";
import useMessage from "@/hooks/useMessage.ts";
import useScroll from "@/hooks/useScroll.ts";
import useSmartTextarea from "@/hooks/useSmartTextarea.ts";
import {ArrowUp} from "lucide-react";
import {Icon, Textarea} from "rael-ui";
import {useParams} from "react-router-dom";

const ChatInput = () => {
    const {chatId} = useParams();
    const {registerConversation} = useChatContext();
    const {submitting, handleSubmitMessage} = useMessageContext();
    const {message, setMessage} = useMessage({registerConversation});
    const {scrollToBottom} = useScroll();

    const {rows, handleKeyPress} = useSmartTextarea({
        onShiftAndEnter: () => {
            setMessage(prev => prev + '\n')
        },
        onEnter: () => {
            handleSubmit()
            scrollToBottom(document.body.scrollHeight);
        },
        value: message
    });

    const handleSubmit = () => {
        handleSubmitMessage(message, chatId || '' ,setMessage)
    }
    
    return (
        <Textarea value={message}
                  rows={rows}
                  onKeyDown={(e) => handleKeyPress(e as unknown as KeyboardEvent)}
                  onChange={(e) => {
                      setMessage(e.target.value)
                  }}
                  className={`w-full shadow-md  border border-gray-400 dark:border-neutral-700 rounded-3xl text-lg   min-h-[32px] h-fit resize-none ${rows === 1 ? 'items-center' : 'items-end'} `}
                  placeholder={'Your message ...'} size={'md'}
                  rightContent={<Icon role={'button'} type={'submit'} disabled={submitting} className={'rounded-2xl'}
                                      onClick={handleSubmit}><ArrowUp
                      size={16}/></Icon>}
        />
    )
}

export default ChatInput;