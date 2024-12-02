import {OllamaModel} from "@/api/ollamaModelsApi.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import OllamaModelCard from "@/components/pages/OllamaModelCard.tsx";
import {useMemo, useState} from "react";
import {Button, cn} from "rael-ui";
import {Eye} from "lucide-react";

type ChatModelListProps = {
    error: Error;
    loading: boolean;
    models: OllamaModel[];
    onRetry: () => void;
    className? : string;
}
const OllamaModelList = ({error, loading, models, onRetry, className}: ChatModelListProps) => {


    const [seeAll, setSeeAll] = useState(false);

    const filteredModels = useMemo(() => {
        if (!models || loading || error) return [];

        // return seeAll ? models.slice(0,100) : models.slice(0, 10)
        return seeAll ? models.slice(0,100) : models.slice(0, 10)
    }, [seeAll, models, onRetry]);

    if (loading)
        return <LoaderUI title={"Getting models"}/>

    if (error)
        return <ErrorUI error={error} onRetry={onRetry}/>
    

    return (
        <div className={cn("grid gap-10 grid-cols-2  max-[1060px]:grid-cols-1", className)}>
            {
                filteredModels?.map((model) => (
                    <OllamaModelCard key={model.name} {...model}/>
                    
                ))
            }
            {
                !seeAll && filteredModels.length < models.length && <Button onClick={() => setSeeAll(true)} >
                    <Eye size={20}/>
                    Show more
                </Button>
            }
        </div>
    );
};

export default OllamaModelList;