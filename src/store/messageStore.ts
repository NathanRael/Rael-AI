import {create} from "zustand";
import {createMessage, newStreamedMessage} from "@/api/MessagesApi.ts";

interface HandleSubmitParams {
    inputValue: string;
    onValidInput: () => void;
    chatbotTypeId: string;
    fileId?: string;
    model: string;
    conversationId : string;
    onSuccess : () => void;
    onFinally : () => void;
}

type MessageStore = {
    submitting: boolean;
    optimisticMessage?: string;
    streamedMessage: string;
    fileId: string;
    setSubmitting: (value: boolean) => void;
    setOptimisticMessage: (message: string) => void;
    setStreamedMessage: (message: string) => void;
    setFileId: (id: string) => void;
    handleSubmitMessage: (params: HandleSubmitParams) => Promise<void>;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
    submitting: false,
    optimisticMessage: '',
    streamedMessage: '',
    fileId: '',

    setSubmitting: (value) => set({ submitting: value }),
    setOptimisticMessage: (message) => set({ optimisticMessage: message }),
    setStreamedMessage: (message) => set({ streamedMessage: message }),
    setFileId: (id) => set({ fileId: id }),

    handleSubmitMessage: async ({ inputValue, conversationId, onValidInput, chatbotTypeId, fileId, model, onSuccess, onFinally }: HandleSubmitParams) => {
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

                onChange: (v) => get().setStreamedMessage( get().streamedMessage + v),
                onFinish: async (fullMessage) => {
                    get().setSubmitting(true);

                    // Saving the chatbot message in the db

                    await createMessage({
                        content : fullMessage,
                        conversation_id: conversationId,
                        model: model,
                        chatbot_type_id: chatbotTypeId,
                        sender : 'bot'
                    })

                    get().setStreamedMessage('');
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
