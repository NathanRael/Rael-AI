import {useEffect, useState} from "react";

const useTheme = () => {
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
    
    
    return {
        darkMode,
        toggleDarkMode,
    }
}

export default useTheme;