import {create} from "zustand";

type MessageStore = {
    submitting : boolean;
    optimisticMessage?: string;
    streamedMessage : string;
}

export const useMessageStore = create<MessageStore>((set) => ({
    submitting : false,
    optimisticMessage : '',
    streamedMessage : '',
    
    
}))