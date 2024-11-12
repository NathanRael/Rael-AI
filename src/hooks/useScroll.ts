import {useCallback} from "react";

const useScroll = () => {
    const scrollToBottom = useCallback((top : number) => {
        window.scrollTo({
            behavior: 'smooth',
            top,
        });
    }, [])
    
    return {scrollToBottom};
    
}

export default useScroll;