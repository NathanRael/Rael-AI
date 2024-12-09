import {create} from "zustand";

type ChatbotTypeStore = {
    selectedChatbotType : string[];
    updateSelectedChatbotType : (chatbotType : string[]) => void;
}

export const useChatbotTypeStore = create<ChatbotTypeStore>((set) => ({ 
    selectedChatbotType: [],
    updateSelectedChatbotType :  (chatbotType) => {
        set({selectedChatbotType : chatbotType});
    }
}))