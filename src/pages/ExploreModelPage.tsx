import {ChevronLeft} from "lucide-react";
import {Icon} from "rael-ui";
import {useNavigate} from "react-router-dom";
import OllamaModelList from "@/components/pages/OllamaModelList.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchOllamaModels} from "@/api/ollamaModelsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useState} from "react";
import OllamaModelListFilter from "@/components/pages/OllamaModelListFilter.tsx";

const ExploreModelPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const {data : ollamaModels, error : ollamaModelError, isLoading : isFetchingOllamaModels, refetch : reFetchOllamaModels} = useQuery({
        queryFn : () => fetchOllamaModels({search}),
        queryKey : [queryKeys.ollamaModelList, {search}]
    })

    return (
        <section className="p-4 space-y-10">
            <Icon onClick={() => navigate(-1)} size={'sm'} variant={'ghost'}>
                <ChevronLeft size={32}/>
            </Icon>
            <div className={'mx-auto w-fit text-center'}>
                <h1 className={'text-[32px] text-black dark:text-white font-bold'}>
                    <span>Models</span>
                </h1>
                <p className={'text-black/80 dark:text-white/80 text-lead space-x-1'}>
                    <span>Find and pull over <span className={'font-bold text-secondary'}>100</span> models from</span>
                    {/*<a href={'https://huggingface.com'} className={'underline'}>hugging face</a>*/}
                    {/*<span>and</span>*/}
                    <a href={'https://ollama.com'} className={'underline'}>ollama</a>
                </p>
            </div>
            <div className={'space-y-10   flex flex-col items-center justify-center'}>
                <OllamaModelListFilter onChange={(v) => setSearch(v)}/>
                <OllamaModelList models={ollamaModels!} error={ollamaModelError as Error} loading={isFetchingOllamaModels} onRetry={() => reFetchOllamaModels()}/>
            </div>
        </section>
    )
};

export default ExploreModelPage;