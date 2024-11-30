import { TextInput, cn } from "rael-ui";
import {Search} from "lucide-react";
import {useEffect, useState} from "react";
import useDebounce from "@/hooks/useDebounce.ts";

type ChatbotTypeProps = {
    className?: string;
    onChange : (searcg : string) => void;
}
const ChatbotTyeListFilter = ({className, onChange} : ChatbotTypeProps) => {
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search);
    
    useEffect(() => {
        onChange(debouncedSearch);
    }, [debouncedSearch]);
    
    return (
        <TextInput value={search} onChange={(e) => setSearch(e.target.value)} rightContent={<Search/>} placeholder={'Search for chatbot'} radius={'xl'} block size={'lg'} className={cn('text-lead', className)}/>
    )
}

export default ChatbotTyeListFilter;