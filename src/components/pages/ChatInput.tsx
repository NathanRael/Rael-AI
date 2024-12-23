import {useMessageContext} from "@/context/MessageProvider.tsx";
import useScroll from "@/hooks/useScroll.ts";
import useSmartTextarea from "@/hooks/useSmartTextarea.ts";
import {ArrowUp, StopCircle} from "lucide-react";
import {Icon, Textarea, useToast} from "rael-ui";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
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
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [message, setMessage] = useState('');

    const { toast, renderToastContainer } = useToast();
    const { chatId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { submitting, handleSubmitMessage } = useMessageContext();
    const { scrollToBottom } = useScroll();
    const queryClient = useQueryClient();

    const user = useUserStore((state) => state.user);
    const models = useModelStore((state) => state.models);
    const formatedModels = useModelStore((state) => state.formatedModels);
    const updateSelectedModel = useModelStore((state) => state.updateSelectedModel);

    const { uploadedImage, setUploadedImage, handleFileUpload } = useFile(file);
    const storage = useLocalStorage();

    const { data: conversations, isLoading: isConversationLoading } = useFetchConversations({});
    const { mutateAsync: newConversationMutation } = useMutation({
        mutationFn: newConversation,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.conversationList]);
            
            if (!conversations || conversations.length === 0) return;

            const newConversationId = conversations[0].id;
            const userInput = fetchFromStorage('userInput');
            const uploadedFileId = fetchFromStorage('fileId');

            navigate(`/chat/${newConversationId}`);
            handleSubmitMessage(userInput, newConversationId, () => setMessage(''), chatbotTypeIdInParams!, uploadedFileId);
        },
    });

    const canSubmit = useMemo(() => !submitting && message.trim() !== '', [submitting, message]);
    const chatbotTypeIdInParams = useMemo(() => searchParams.get('chatType'), [searchParams]);
    const visionModels = useMemo(() => formatedModels.filter((model) => model.capability === 'vision'), [formatedModels]);

    const resetImageContent = useCallback(() => {
        setUploadedImage('');
        setFile(null);
    }, [setUploadedImage, setFile]);

    const fetchFromStorage = (key: string) => storage.getItem(key) || '';

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
                await handleSubmitMessage(message, chatId, () => setMessage(''), chatbotTypeId, uploadedFileId);
                return;
            }

            storage.setItem('userInput', message);
            storage.setItem('fileId', uploadedFileId);
            setMessage('');
            resetImageContent();

            const generatedTitle = await generateMessage({
                prompt: `Give me a suitable title for this message: '${message}'. Don't be verbose. Just the title.`,
            });

            await newConversationMutation({
                user_id: user.id,
                title: generatedTitle,
                chatbot_type_id: chatbotTypeIdInParams || '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const { handleKeyPress } = useSmartTextarea({
        onEnter: () => {
            if (canSubmit) {
                setMessage('');
                handleSubmit();
                scrollToBottom(document.body.scrollHeight);
            }
        },
        value: message,
    });
    


    return (
        <div className={'relative h-fit'}>
            {renderToastContainer()}
            {uploadedImage &&
                <ImageInputPreview className={'absolute -top-[132px]'} image={uploadedImage} onClose={() => {
                    resetImageContent()
                }}/>}
            <Textarea
                ref={inputRef}
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