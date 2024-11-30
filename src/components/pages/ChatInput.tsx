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
import {generateMessage} from "@/api/promptsApi.ts";
import useLocalStorage from "@/hooks/useLocalStorage.ts";

const ChatInput = () => {
    const {chatId} = useParams();
    const {submitting, handleSubmitMessage} = useMessageContext();
    const [message, setMessage] = useState("");
    const {scrollToBottom} = useScroll();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    const [searchParams] = useSearchParams();
    
    const storage = useLocalStorage();

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
            const chatbotTypeId = conversations!.find(conversation => conversation.id === chatId)!.chatbot_type_id
            handleSubmitMessage(message, chatId, () => setMessage(''), chatbotTypeId)
            return
        }
        
        storage.setItem('userInput', message )
        setMessage('')
        setSuccess(false)
        try {
            const userInput =  storage.getItem('userInput')
            const generatedTitle : string = await generateMessage({prompt : `Give me a suitable title for this message : '${userInput}'.Don't be verbose.Just give the response without commentary`})
            await newConversationMutation({
                user_id: USER_ID,
                title: generatedTitle.replace("\"", ''),
                chatbot_type_id : chatbotTypeIdInParams || ''
            })
        } catch (e) {
            console.error(e)
        }
    }

    // Redirecting the user to the  created conversation
    useEffect(() => {
        if (conversations && !isConversationLoading && success) {
            const newConversationId = conversations[0].id
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
            className={`w-full shadow-md z-40   rounded-3xl text-lg    min-h-[32px]  resize-none ${rows === 1 ? 'items-center' : 'items-end'} `}
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