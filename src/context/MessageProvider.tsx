import * as React from "react";
import {createContext, useContext} from "react";
import useMessages from "@/hooks/useMessages.ts";

interface MessageContext {
    handleSubmitMessage : (inputValue : string, chatId : string,  onValidInput : () => void, chatbotTypeId : string, fileId?: string) => Promise<void>;
    submitting : boolean;
    optimisticMessage?: string;
    streamedMessage : string;
    fileId : string;
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