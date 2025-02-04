import {create} from "zustand";
import {createMessage, newStreamedMessage, StreamedMessage} from "@/api/MessagesApi.ts";
import {MutableRefObject} from "react";

interface HandleSubmitParams {
    inputValue: string;
    onValidInput: () => void;
    chatbotTypeId: string;
    fileId?: string;
    model: string;
    conversationId : string;
    onSuccess : () => void;
    onFinally : () => void;
    abortController : MutableRefObject<AbortController | null>
}



type MessageStore = {
    submitting: boolean;
    optimisticMessage?: string;
    streamedMessage: StreamedMessage;
    fileId: string;
    setSubmitting: (value: boolean) => void;
    setOptimisticMessage: (message: string) => void;
    setStreamedMessage: (message: StreamedMessage) => void;
    setFileId: (id: string) => void;
    handleSubmitMessage: (params: HandleSubmitParams) => Promise<void>;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
    submitting: false,
    optimisticMessage: '',
    streamedMessage: {
        chainOfThought: '',
        finalResponse: '',
    },
    fileId: '',

    setSubmitting: (value) => set({ submitting: value }),
    setOptimisticMessage: (message) => set({ optimisticMessage: message }),
    setStreamedMessage: (message) => set({ streamedMessage: message }),
    setFileId: (id) => set({ fileId: id }),

    handleSubmitMessage: async ({ inputValue, conversationId, onValidInput, chatbotTypeId, fileId, model, onSuccess, onFinally, abortController }: HandleSubmitParams) => {
        if (inputValue === '' || !inputValue) return

        if (model === '') return console.error('Please select a model')
        onValidInput();

        get().setSubmitting(true);
        get().setOptimisticMessage(inputValue);
        get().setFileId(fileId || '');
        
        try {
            await newStreamedMessage({
                conversation_id: conversationId,
                content: inputValue,
                model: model,
                chatbot_type_id: chatbotTypeId,
                file_id : fileId,
                 abortController,
                
                onChange: (v) =>{
                    get().setStreamedMessage({
                        chainOfThought: get().streamedMessage.chainOfThought + v.chainOfThought,
                        finalResponse: get().streamedMessage.finalResponse + v.finalResponse,
                    })
                },
                onFinish: async (fullMessage) => {
                    get().setSubmitting(true);
                    
                    await createMessage({
                        content : fullMessage,
                        conversation_id: conversationId,
                        model: model,
                        chatbot_type_id: chatbotTypeId,
                        sender : 'bot'
                    })

                    get().setStreamedMessage({
                        chainOfThought : '',
                        finalResponse : '',
                    });
                    get().setOptimisticMessage('');
                    
                    onSuccess()
                }
            })

        } catch (e) {
            console.error(e)
        } finally {
            get().setSubmitting(false)
            onFinally()
        }
    },
}));
