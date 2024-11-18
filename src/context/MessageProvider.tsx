import {ChangeEvent, createContext, useContext} from "react";
import useMessage from "@/hooks/useMessage.ts";
import {useChatContext} from "@/context/ChatProvider.tsx";
import * as React from "react";

interface MessageContext {
    message: string;
    setMessage : React.Dispatch<React.SetStateAction<string>>;
    handleSubmitMessage : (message : string, chatId : string, setMessage : React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    submitting : boolean;
    setSubmitting : React.Dispatch<React.SetStateAction<boolean>>;
    handleInput : (e : ChangeEvent<HTMLTextAreaElement>) => void;
}

const MessageContext = createContext<MessageContext | undefined>(undefined);
const MessageProvider = ({children}: { children: React.ReactNode }) => {
    const {registerConversation, selectedModel} = useChatContext();
    const props = useMessage({registerConversation, selectedModel});
    return (
        <MessageContext.Provider value={props}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageContext = () => useContext(MessageContext) as MessageContext;


export default MessageProvider;