import {createContext, useContext} from "react";
import {MessageFeedProps} from "@/components/pages/MessageFeed.tsx";
import useChat from "@/hooks/useChat.ts";

interface ChatContext {
    loading: boolean;
    error: string;
    conversations: MessageFeedProps[];
    registerConversation: (message: MessageFeedProps['message'], sender: MessageFeedProps['sender']) => void;
    fetchConversations: (chatId : string) => Promise<() => void>;
    selectedModel : string;
    setSelectedModel : React.Dispatch<React.SetStateAction<string>>;
}

const ChatContext = createContext<ChatContext | undefined>(undefined);

const ChatProvider = ({children}: { children: React.ReactNode }) => {
    const props = useChat();
    return (
        <ChatContext.Provider value={props}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext) as ChatContext;

export default ChatProvider;