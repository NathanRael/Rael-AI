import {useMessageContext} from "@/context/MessageProvider.tsx";
import useScroll from "@/hooks/useScroll.ts";
import useSmartTextarea from "@/hooks/useSmartTextarea.ts";
import {ArrowUp} from "lucide-react";
import {Icon, Textarea} from "rael-ui";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {generateMessage} from "@/api/promptsApi.ts";
import {useUserStore} from "@/store/userStore.ts";
import ChatFileInput from "@/components/ui/ChatFileInput.tsx";
import ImageInputPreview from "@/components/ui/ImageInputPreview.tsx";
import {useStorageHandler} from "@/hooks/useStorageHandler.ts";
import {useConversationHandler} from "@/hooks/useConversationHandler.ts";
import {useModelHandler} from "@/hooks/useModelHandler.ts";
import {useFileHandler} from "@/hooks/useFileHandler.ts";
import {useMessageStore} from "@/store/messageStore.ts";
import {queryKeys} from "@/api/queryKeys.ts";




const ChatInput = () => {
    const [message, setMessage] = useState('');
    
    const {chatId} = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    
    const user = useUserStore((state) => state.user);
    
    const submitting = useMessageStore(state => state.submitting)
    const submitMessage = useMessageStore(state => state.handleSubmitMessage)
    
    
    const {scrollToBottom} = useScroll();
    const {models, updateSelectedModel, visionModels, selectedModel} = useModelHandler()
    const {resetImageContent, uploadedImage, handleFileUpload, setFile, file} = useFileHandler()
    const {getFromStorage, setToStorage} = useStorageHandler()
    const {createNewConversation, newConversationCreated, isConversationLoading, conversations} = useConversationHandler({queryClient})
    const {handleKeyPress} = useSmartTextarea({
        onEnter: () => {
            if (canSubmit) {
                setMessage('');
                handleSubmit();
                scrollToBottom(document.body.scrollHeight);
            }
        },
        value: message,
    });
    
    const canSubmit = useMemo(() => !submitting && message.trim() !== '', [submitting, message]);
    const chatbotTypeIdInParams = useMemo(() => searchParams.get('chatType'), [searchParams]);

    const handleSubmitMessageAdapter = async (message : string, conversationId : string, chatbotTypeId : string, fileId : string) => {
        await submitMessage({
            inputValue : message,
            fileId,
            model : selectedModel,
            conversationId,
            chatbotTypeId,
            onSuccess :async () => {
                await queryClient.invalidateQueries([queryKeys.chat]);
                await queryClient.invalidateQueries([queryKeys.conversationList]);
            },
            onValidInput : () => setMessage(''),
            onFinally : () => scrollToBottom(document.body.scrollHeight),
        })
    }
    
    
    const handleSubmit = async () => {
        try {
            let uploadedFileId = '';

            if (file) {
                const visionModel = models.find((m) =>
                    visionModels[0].name.split(':')[0].includes(m.split(':')[0])
                );
                updateSelectedModel(visionModel!);
                const uploadedFile = await handleFileUpload(file);
                uploadedFileId = uploadedFile?.id || '';
            }
            

            if (chatId && !isConversationLoading) {
                const chatbotTypeId = conversations!.find((conv) => conv.id === chatId)!.chatbot_type_id;
                resetImageContent();
                await handleSubmitMessageAdapter(message, chatId, chatbotTypeId, uploadedFileId);
                return;
            }

            setToStorage('userInput', message);
            setToStorage('fileId', uploadedFileId);
            setMessage('');
            resetImageContent();

            const generatedTitle = await generateMessage({
                prompt: `Give me a suitable title for this message: '${message}'. Don't be verbose. Just the title.`,
            });

            await createNewConversation({
                userId: user.id,
                title: generatedTitle,
                chatbotTypeId: chatbotTypeIdInParams || '',
            });
            
        } catch (error) {
            console.error(error);
        }
    };

    

    useEffect(() => {
        if (!conversations || conversations.length === 0 || !newConversationCreated) return;

        const newConversationId = conversations[0].id;
        const userInput = getFromStorage('userInput');
        const uploadedFileId = getFromStorage('fileId');

        navigate(`/chat/${newConversationId}`);
        handleSubmitMessageAdapter(userInput, newConversationId, chatbotTypeIdInParams!, uploadedFileId);
        
    }, [newConversationCreated, conversations, isConversationLoading]);


    return (
        <div className={'relative h-fit'}>
            {uploadedImage &&
                <ImageInputPreview className={'absolute -top-[132px]'} image={uploadedImage} onClose={() => {
                    resetImageContent()
                }}/>}
            
            <Textarea
                size={'lg'}
                value={message}
                variant={'fill'}
                onKeyDown={(e) => {
                    handleKeyPress(e as unknown as KeyboardEvent)
                }}
                onChange={(e) => {
                    setMessage(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight >= 320 ? 320 : e.target.scrollHeight}px`
                }}
                className={`w-full shadow-sm z-40   rounded-3xl text-lg    min-h-[32px]  resize-none items-end`}
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