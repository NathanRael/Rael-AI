import {createContext, useContext} from "react";
import * as React from "react";
import {useUserPrefContext} from "@/context/UserPrefProvider.tsx";
import useMessages from "@/hooks/useMessages.ts";
import {useModelStore} from "@/store/useModelStore.ts";

interface MessageContext {
    handleSubmitMessage : (inputValue : string, chatId : string,  onValidInput : () => void, chatbotTypeId : string, fileId?: string) => Promise<void>;
    submitting : boolean;
    optimisticMessage?: string;
    streamedMessage : string;
}

const MessageContext = createContext<MessageContext | undefined>(undefined);
const MessageProvider = ({children}: { children: React.ReactNode }) => {
    const props = useMessages();
    
    return (
        <MessageContext.Provider value={props}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageContext = () => useContext(MessageContext) as MessageContext;


export default MessageProvider;