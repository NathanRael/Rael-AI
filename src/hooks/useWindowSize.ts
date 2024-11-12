import {useEffect, useState} from "react";

const useWindowSize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    
    useEffect(() => {
        const updateSize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        
        window.addEventListener('resize', updateSize);
        
        return () => {
            window.removeEventListener('resize', updateSize);
        }
    }, []);
    
    return {width, height};
}

export default useWindowSize