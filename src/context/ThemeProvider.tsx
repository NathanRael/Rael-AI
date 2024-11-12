import {createContext, useContext, useEffect, useState} from "react";

interface ThemeContext {
    darkMode: boolean;
    setDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
    toggleDarkMode : () => void;
}

const ThemContext = createContext<ThemeContext | undefined>(undefined);

export const useThemeContext = () => useContext(ThemContext) as ThemeContext;

const ThemeProvider = ({children}: { children: React.ReactNode }) => {
    const storedTheme = JSON.parse(localStorage.getItem("darkMode") || "false");
    const [darkMode, setDarkMode] = useState<boolean>(storedTheme);
    const toggleDarkMode = () => {
        setDarkMode(prev => {
            localStorage.setItem('darkMode', JSON.stringify(!prev));
            return !prev;
        });
    }

    useEffect(() => {
        document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);
    
    return (
        <ThemContext.Provider value={{darkMode, toggleDarkMode}}>
            {children}
        </ThemContext.Provider>
    )
}

export default ThemeProvider;