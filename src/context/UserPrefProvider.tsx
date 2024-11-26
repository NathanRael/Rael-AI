import {createContext, useContext, useState} from "react";
import useTheme from "@/hooks/useTheme.ts";

interface UserPrefContext {
    selectedModel : string;
    setSelectedModel : (selectedModel : string) => void;darkMode: boolean;
    
    setDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
    toggleDarkMode : () => void;
}

const UserPrefContext = createContext<UserPrefContext | undefined>(undefined);

export const useUserPrefContext = () => {
    const context = useContext(UserPrefContext);
    if (!context) {
        throw new Error('useUserPrefContext must be used within the context');
    }
    
    return context;
}

const UserPrefProvider = ({children}: { children: React.ReactNode }) => {
    
    const [selectedModel, setSelectedModel] = useState('llama3')
    const themeProps = useTheme();
    
    return (
        <UserPrefContext.Provider value={{selectedModel, setSelectedModel, ...themeProps}}>
            {children}
        </UserPrefContext.Provider>
    )
}

export  default UserPrefProvider;