import {ChevronRight, Slack} from "lucide-react";
import {Button} from "rael-ui";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchOllamaModels} from "@/api/ollamaModelsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import OllamaModelList from "@/components/pages/OllamaModelList.tsx";
import {useMemo} from "react";
import Stepper from "@/components/ui/Stepper.tsx";
import {MainPageImageDark, MainPageImageLight} from "@/constants/images.ts";
import {fetchModels} from "@/api/modelsApi.ts";
import {useUserPrefStore} from "@/store/userPrefStore.ts";

const OnboardingPageChooseModel = () => {
    const navigate = useNavigate();
    const darkMode = useUserPrefStore(state => state.darkMode);
    const {data : downloadedModels, isLoading} = useQuery({
        queryFn : () => fetchModels(true),
        queryKey : [queryKeys.formatedModelList]
    })
    
    const hasDownloadedModel = useMemo(() => {
        if (isLoading || !downloadedModels)
            return false
        return downloadedModels.length > 0
    }, [downloadedModels, isLoading])
    
    return (
        <section className="onboarding-page flex gap-6 h-screen w-full">
            <div className={"basis-1/2 flex flex-col gap-10"}>
                <PullModel/>
                <Stepper disabled={{prevButton: false, nextButton : !hasDownloadedModel || isLoading}}   onNext={() => {
                    navigate('/onboarding/selectChatbotType')
                }}  className={''}/>
            </div>
            <div
                className="basis-1/2   overflow-hidden p-2 rounded-2xl flex flex-col gap-2 justify-between relative">
                <img src={MainPageImageDark} className={' border-black/10 dark:border-white/10 border-4  skew-x-2 object-cover rounded-xl overflow-hidden w-full object-top'}
                     alt={'MainPage chatbot page'}/>
                <div className={'relative border-black/10 dark:border-white/10 border-4 overflow-hidden -skew-x-2 rounded-xl '}>
                    {darkMode && <div className={'absolute w-full h-full bg-black/60'}/>}
                    <img src={MainPageImageLight} className={'  object-cover rounded-xl overflow-hidden  w-full'}
                         alt={'MainPage chatbot page'}/>
                </div>
                {/*<img src={ChatPageImage} className={' object-contain rounded-xl overflow-hidden'} alt={'Chat page'}/>*/}
            </div>
        </section>
    );
};

export default OnboardingPageChooseModel;

const PullModel = () => {
    const navigate = useNavigate();
    const {
        data: ollamaModels,
        error: ollamaModelError,
        isLoading: isFetchingOllamaModels,
        refetch: reFetchOllamaModels
    } = useQuery({
        queryFn: () => fetchOllamaModels(),
        queryKey: [queryKeys.ollamaModelList]
    })
 
    const recommendedModel = useMemo(() => {
        
        if (isFetchingOllamaModels || ollamaModelError || !ollamaModels)
            return []
        return ollamaModels!.filter(model => model.name === 'llama3.2' || model.name === 'llama3')

    }, [ollamaModels])
    
    
    
    return (
        <div className=" flex flex-col gap-10 ">
            <div className={'max-w-[540px]'}>
                <h1 className={'text-black dark:text-white text-big-title font-bold'}>Download a model</h1>
                <p className={'text-lead text-black/80 dark:text-white/80'}>Select a model to download, make sur that you download models that can be used for chat purpose</p>
            </div>
            <div className={'flex flex-col gap-8 items-start rounded-xl '}>
                <div className={'space-y-4'}>
                    {/*<h1 className={'text-lead text-black dark:text-white'}>Recommended model</h1>*/}
                    <OllamaModelList className={'grid-cols-1'} error={ollamaModelError as Error}
                                     loading={isFetchingOllamaModels}
                                     models={recommendedModel} onRetry={() => reFetchOllamaModels()}/>
                </div>
                <Button onClick={() => navigate('/models/explore')} size={'sm'} variant={'ghost'} radius={'xl'}>
                    <Slack size={16}/>
                    Explore other
                    <ChevronRight/>
                </Button>
            </div>
        </div>
    )
}