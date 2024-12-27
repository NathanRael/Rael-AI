import {useRef, useState} from "react";

const useChatInput = () => {
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [message, setMessage] = useState('');
    
    
}

export default useChatInput;