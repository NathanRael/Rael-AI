import {ChangeEvent, createContext, useContext} from "react";
import useMessage from "@/hooks/useMessage.ts";
import {useChatContext} from "@/context/ChatProvider.tsx";

interface MessageContext {
    message: string;
    setMessage : React.Dispatch<React.SetStateAction<string>>;
    handleSubmitMessage : () => Promise<void>;
    submitting : boolean;
    handleInput : (e : ChangeEvent<HTMLTextAreaElement>) => void;
}

const MessageContext = createContext<MessageContext | undefined>(undefined);
const MessageProvider = ({children}: { children: React.ReactNode }) => {
    const {registerConversation} = useChatContext();
    const props = useMessage({registerConversation});
    return (
        <MessageContext.Provider value={props}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageContext = () => useContext(MessageContext) as MessageContext;


export default MessageProvider;