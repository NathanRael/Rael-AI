import {createContext, useContext} from "react";
import * as React from "react";
import {useUserPrefContext} from "@/context/UserPrefProvider.tsx";
import useMessages from "@/hooks/useMessages.ts";

interface MessageContext {
    handleSubmitMessage : (inputValue : string, chatId : string,  setInputValue : React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    submitting : boolean;
    optimisticMessage?: string
}

const MessageContext = createContext<MessageContext | undefined>(undefined);
const MessageProvider = ({children}: { children: React.ReactNode }) => {
    const {selectedModel} = useUserPrefContext();
    const props = useMessages({selectedModel});
    
    return (
        <MessageContext.Provider value={props}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageContext = () => useContext(MessageContext) as MessageContext;


export default MessageProvider;