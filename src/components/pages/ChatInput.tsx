import {useMessageContext} from "@/context/MessageProvider.tsx";
import useScroll from "@/hooks/useScroll.ts";
import useSmartTextarea from "@/hooks/useSmartTextarea.ts";
import {ArrowUp} from "lucide-react";
import {Icon, Textarea} from "rael-ui";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {newConversation} from "@/api/conversationsApi.ts";
import useFetchConversations from "@/hooks/useFetchConversations.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {USER_ID} from "@/constants";

const ChatInput = () => {
    const {chatId} = useParams();
    const {submitting, handleSubmitMessage} = useMessageContext();
    const [message, setMessage] = useState("");
    const {scrollToBottom} = useScroll();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    const [searchParams] = useSearchParams();

    const {data: conversations, isLoading: isConversationLoading} = useFetchConversations({})
    const {mutateAsync: newConversationMutation} = useMutation({
        mutationFn: newConversation,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.conversationList])
            setSuccess(true)
        }
    })
    const {rows, handleKeyPress} = useSmartTextarea({
        onEnter: () => {
            setMessage("");
            if (!canSubmit)
                return

            handleSubmit()
            scrollToBottom(document.body.scrollHeight);
        },
        value: message
    });

    const canSubmit : boolean = useMemo(() => !submitting && message.trim() !== '', [submitting, message])
    const chatbotTypeIdInParams = useMemo(() => searchParams.get('chatType'), [searchParams]);
   

    const handleSubmit = async () => {
        if (chatId && !isConversationLoading) {
            // console.log('chatId', chatId, conversations[0].chatbot_type_id);
            // console.log('conv', conversations!.find(conv => conv.chatbot_type_id === chatId))
            const chatbotTypeId = conversations!.find(conversation => conversation.id === chatId)!.chatbot_type_id
            handleSubmitMessage(message, chatId, () => setMessage(''), chatbotTypeId)
            return
        }
        
        // Creating new conversation , when the user is in the main page
        localStorage.setItem('userInput', JSON.stringify(message))
        setMessage('')
        setSuccess(false)
        try {
            await newConversationMutation({
                user_id: USER_ID,
                title: JSON.parse(localStorage.getItem('userInput') || ''),
                chatbot_type_id : chatbotTypeIdInParams || ''
            })
        } catch (e) {
            console.error(e)
        }
    }

    // Redirecting the user to the  created conversation
    useEffect(() => {
        if (conversations && !isConversationLoading && success) {
            const newConversationId = conversations[conversations.length - 1].id
            const userInput = JSON.parse(localStorage.getItem('userInput') || '')
            navigate(`/chat/${newConversationId}`);

            handleSubmitMessage(userInput, newConversationId, () => setMessage(''), chatbotTypeIdInParams!)
        }
    }, [conversations]);

    return (
        <Textarea
            size={'lg'}
            value={message}
            variant={'fill'}
            // rows={1}
            onKeyDown={(e) => {
                handleKeyPress(e as unknown as KeyboardEvent)
            }}
            onChange={(e) => {
                setMessage(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${e.target.scrollHeight >= 320 ? 320 : e.target.scrollHeight}px`
            }}
            className={`w-full shadow-md   rounded-3xl text-lg    min-h-[32px]  resize-none ${rows === 1 ? 'items-center' : 'items-end'} `}
            inputClassName={'hide-scrollbar overflow-y-hidden'}
            placeholder={'Your message ...'}
            rightContent={<Icon role={'button'} type={'submit'} disabled={!canSubmit}
                                className={'rounded-2xl'}
                                onClick={handleSubmit}><ArrowUp
                size={16}/></Icon>}
        />
    )
}

export default ChatInput;