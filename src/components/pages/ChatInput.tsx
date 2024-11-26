import {useMessageContext} from "@/context/MessageProvider.tsx";
import useScroll from "@/hooks/useScroll.ts";
import useSmartTextarea from "@/hooks/useSmartTextarea.ts";
import {ArrowUp} from "lucide-react";
import {Icon, Textarea} from "rael-ui";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { newConversation} from "@/api/conversationsApi.ts";
import useFetchConversations from "@/hooks/useFetchConversations.ts";
import {queryKeys} from "@/api/queryKeys.ts";

const ChatInput = () => {
    const {chatId} = useParams();
    const {submitting, handleSubmitMessage} = useMessageContext();
    const [message, setMessage] = useState("");
    const {scrollToBottom} = useScroll();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    
    const {data : conversations, isLoading : isConversationLoading} = useFetchConversations({})

    const {mutateAsync: newConversationMutation} = useMutation({
        mutationFn: newConversation,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.conversationList])
            setSuccess(true)
        }
    })
    
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
    
    
    const createConversation = async () => {
        setSuccess(false)
        try {
            await newConversationMutation({
                user_id: '1',
                title: JSON.parse(localStorage.getItem('userInput') || ''),
            })
        } catch (e) {
            console.error(e)
        }
    }

    const handleSubmit = () => {
        if (chatId) {
            handleSubmitMessage(message, chatId, setMessage)
            return
        }
        localStorage.setItem('userInput', JSON.stringify(message))
        setMessage('')
        createConversation()
    }

    // Redirecting the user to the  created conversation
    useEffect(() => {
        if (conversations && !isConversationLoading && success){
            const newConversationId = conversations[conversations.length - 1].id
            const userInput = JSON.parse(localStorage.getItem('userInput') || '')
            navigate(`/chat/${newConversationId}`);
            
            handleSubmitMessage(userInput, newConversationId, setMessage)
        }
    }, [conversations]);
    

    return (
        <Textarea value={message}
                  rows={rows}
                  onKeyDown={(e) => handleKeyPress(e as unknown as KeyboardEvent)}
                  onChange={(e) => {
                      setMessage(e.target.value)
                  }}
                  className={`w-full shadow-md  border border-gray-400 dark:border-neutral-700 rounded-3xl text-lg   min-h-[32px] h-fit resize-none ${rows === 1 ? 'items-center' : 'items-end'} `}
                  placeholder={'Your message ...'} size={'md'}
                  rightContent={<Icon role={'button'} type={'submit'} disabled={submitting || message === ''}
                                      className={'rounded-2xl'}
                                      onClick={handleSubmit}><ArrowUp
                      size={16}/></Icon>}
        />
    )
}

export default ChatInput;