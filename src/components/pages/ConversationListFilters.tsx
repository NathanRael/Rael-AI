import {Search} from "lucide-react";
import {TextInput} from "rael-ui";
import {useEffect, useState} from "react";
import {ConversationFilters} from "@/api/conversationsApi.ts";
import useDebounce from "@/hooks/useDebounce.ts";

type ConversationListFilters = {
    onChange: (filters: ConversationFilters) => void;
}
const ConversationListFilters = ({onChange}: ConversationListFilters) => {

    const [search, setSearch] = useState<ConversationFilters['search']>('');
    const debouncedSearch = useDebounce(search)

    useEffect(() => {
        onChange({search: debouncedSearch!});
    }, [debouncedSearch]);

    return (
        <>
            <TextInput
                onChange={(e) => setSearch(e.target.value)}
                block
                placeholder={'Search chat type or histories'}
                leftContent={<Search size={16}/>}/>
        </>
    )
}

export default ConversationListFilters