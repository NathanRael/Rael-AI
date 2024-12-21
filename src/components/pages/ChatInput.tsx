import {useMessageContext} from "@/context/MessageProvider.tsx";
import useScroll from "@/hooks/useScroll.ts";
import useSmartTextarea from "@/hooks/useSmartTextarea.ts";
import {ArrowUp, StopCircle} from "lucide-react";
import {Icon, Textarea, useToast} from "rael-ui";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {newConversation} from "@/api/conversationsApi.ts";
import useFetchConversations from "@/hooks/useFetchConversations.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {generateMessage} from "@/api/promptsApi.ts";
import useLocalStorage from "@/hooks/useLocalStorage.ts";
import {useUserStore} from "@/store/userStore.ts";
import ChatFileInput from "@/components/ui/ChatFileInput.tsx";
import ImageInputPreview from "@/components/ui/ImageInputPreview.tsx";
import useFile from "@/hooks/useFile.ts";
import {useModelStore} from "@/store/modelStore.ts";

const ChatInput = () => {
    const [file, setFile] = useState<File | null>(null)
    const {toast, renderToastContainer} = useToast();
    const {chatId} = useParams();
    const {submitting, handleSubmitMessage} = useMessageContext();
    const [message, setMessage] = useState("");
    const {scrollToBottom} = useScroll();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    const [searchParams] = useSearchParams();
    const user = useUserStore(state => state.user);
    const formatedModels = useModelStore(state => state.formatedModels)
    const visionModels = useMemo(() => formatedModels.filter(model => model.capability === 'vision'), [formatedModels]);
    const models = useModelStore(state => state.models);
    const updateSelectedModel = useModelStore(state => state.updateSelectedModel)
    const selectedModel = useModelStore(state => state.selectedModel)

    const canSubmit: boolean = useMemo(() => !submitting && message.trim() !== '', [submitting, message])
    const chatbotTypeIdInParams = useMemo(() => searchParams.get('chatType'), [searchParams]);

    const storage = useLocalStorage();

    const {data: conversations, isLoading: isConversationLoading} = useFetchConversations({})
    const {mutateAsync: newConversationMutation} = useMutation({
        mutationFn: newConversation,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.conversationList])
            setSuccess(true)
        }
    })
    const {handleKeyPress} = useSmartTextarea({
        onEnter: () => {
            setMessage("");
            if (!canSubmit)
                return
            handleSubmit()
            scrollToBottom(document.body.scrollHeight);
        },
        value: message
    });

    const {uploadedImage, setUploadedImage, handleFileUpload} = useFile(file);

    const resetImageContent = () => {
        setUploadedImage('')
        setFile(null)
    }


    const handleSubmit = async () => {

        if (file) {
            const visionModel = models.filter(m => visionModels[0].name.split(':')[0].includes(m.split(':')[0]))[0]
            updateSelectedModel(visionModel)
        }


        const uploadedFile = await handleFileUpload(file);


        // Handle the submit when user already started a conversation
        if (chatId && !isConversationLoading) {
            const chatbotTypeId = conversations!.find(conversation => conversation.id === chatId)!.chatbot_type_id
            resetImageContent()
            await handleSubmitMessage(message, chatId, () => setMessage(''), chatbotTypeId, uploadedFile?.id)
            return
        }

        storage.setItem('userInput', message)
        storage.setItem('fileId', uploadedFile?.id || '')
        setMessage('')
        resetImageContent()

        setSuccess(false)
        try {
            const userInput = storage.getItem('userInput')
            const generatedTitle: string = await generateMessage({prompt: `Give me a suitable title for this message : '${userInput}'.Don't be verbose.Just give the response without commentary`})
            await newConversationMutation({
                user_id: user.id,
                title: generatedTitle,
                chatbot_type_id: chatbotTypeIdInParams || ''

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
            const uploadedFileId = JSON.parse(localStorage.getItem('fileId') || '')

            navigate(`/chat/${newConversationId}`);

            handleSubmitMessage(userInput, newConversationId, () => setMessage(''), chatbotTypeIdInParams!, uploadedFileId)
        }
    }, [conversations]);


    return (
        <div className={'relative h-fit'}>
            {renderToastContainer()}
            {uploadedImage &&
                <ImageInputPreview className={'absolute -top-[132px]'} image={uploadedImage} onClose={() => {
                    resetImageContent()
                }}/>}
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
                className={`w-full shadow-md z-40   rounded-3xl text-lg    min-h-[32px]  resize-none items-end`}
                inputClassName={'hide-scrollbar overflow-y-auto'}
                placeholder={'Your message ...'}
                leftContent={<ChatFileInput disabled={visionModels.length === 0} deleteFileContent={file === null}
                                            onChange={(file) => setFile(file)}/>}
                rightContent={
                    <>
                        <SubmitButton canSubmit={canSubmit} handleSubmit={handleSubmit}/>
                    </>

                }
            />
        </div>
    )
}

export default ChatInput;


const SubmitButton = ({canSubmit, handleSubmit}: { canSubmit: boolean, handleSubmit: () => Promise<void> }) => {
    return (
        <Icon role={'button'} type={'submit'} disabled={!canSubmit}
              className={'rounded-2xl button-gradient'}
              onClick={handleSubmit}><ArrowUp
            size={16}/></Icon>
    )
}

const CancelButton = () => {
    const handleStopGenerating = () => {

    }
    return (
        <Icon role={'button'} type={'submit'}
              className={'rounded-2xl button-gradient'}
              onClick={handleStopGenerating}><StopCircle
            size={16}/></Icon>
    )
}