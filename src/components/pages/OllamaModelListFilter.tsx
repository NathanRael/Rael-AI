import {useEffect, useState} from "react";
import useDebounce from "@/hooks/useDebounce.ts";
import {Search} from "lucide-react";
import {TextInput} from "rael-ui";

const OllamaModelListFilter = ({onChange}: { onChange: (search: string) => void }) => {
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search);

    useEffect(() => {
        onChange(debouncedSearch);
    }, [debouncedSearch]);
    return (
        <TextInput onChange={(e) => setSearch(e.target.value)} leftContent={<Search/>} size={'lg'}
                   className={'w-[50%] max-md:w-full mx-auto rounded-xl text-lead'}
                   placeholder={'Search models'}/>
    );
};

export default OllamaModelListFilter;