import {
    cn,
    Select,
    SelectGroup,
    SelectGroupContainer,
    SelectGroupTitle,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    Stack,
    useToast
} from "rael-ui"
import {ChevronDownIcon} from "lucide-react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchModels, Model} from "@/api/modelsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {fetchUserPreferences} from "@/api/userPreferencesApi.ts";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import {useUserStore} from "@/store/userStore.ts";
import {useEffect} from "react";
import {useModelStore} from "@/store/modelStore.ts";
import {useModelHandler} from "@/hooks/useModelHandler.ts";

const ModelSwitcher = ({className}: { className?: string }) => {
    const {renderToastContainer} = useToast();
    const user = useUserStore(state => state.user)
    const queryClient = useQueryClient()
    const updateModels = useModelStore(state => state.updateModels)
    const updateFormatedModel = useModelStore(state => state.updateFormatedModels)
    
    const {changeModel} = useModelHandler({queryClient, user});
    
    const {data: models, error: modelsError, isLoading: isFetchingModels, isSuccess, refetch : reFetchModels} = useQuery({
        queryFn: () => fetchModels(),
        queryKey: [queryKeys.modelList]
    })

    const {data: visionModels, isSuccess: isVisionModelFetched} = useQuery({
        queryFn: () => fetchModels(true),
        queryKey: [queryKeys.formatedModelList]
    })


    const {data: userPreferences, isLoading: isFetchingUserPreferences} = useQuery({
        enabled: !!user.id,
        queryFn: () => fetchUserPreferences(user.id),
        queryKey: [queryKeys.userPreferences],
    })
    

    useEffect(() => {
        if (!isSuccess || !models) return
        updateModels(models as string[])
    }, [isSuccess])

    useEffect(() => {
        if (!isVisionModelFetched || !visionModels) return
        updateFormatedModel(visionModels as Model[])
    }, [isVisionModelFetched]);


    if (isFetchingUserPreferences || isFetchingModels)
        return <div className={cn("h-8 animate-pulse rounded-lg w-[108px] bg-black/20 dark:bg-white/20", className)}/>

    if (modelsError)
        return <ErrorUI error={modelsError as Error} onRetry={() => reFetchModels()}/>



    return (
        <Stack className={className}>
            {renderToastContainer()}
            <div className={'flex flex-col items-start justify-start gap-1'}>
                <Select
                    variant={'fill'}
                    defaultValue={userPreferences?.model}
                    className={'w-fit'}
                    onChange={(e) => changeModel(e.target.value as string)}
                >
                    <SelectTrigger className={'bg-transparent dark:bg-transparent w-fit'}>
                        <SelectLabel placeholder={"Select a model"}/>
                        <ChevronDownIcon/>
                    </SelectTrigger>
                    <SelectGroupContainer className={'left-1/2 -translate-x-1/2 w-[240px]'}>
                        <SelectGroup>
                            <SelectGroupTitle>{isFetchingModels ? 'Getting models' : 'Models'}</SelectGroupTitle>
                            {
                                (!modelsError && !isFetchingModels && models) && (models as string[])?.map(model => (
                                    <SelectItem key={model} value={model}>{model}</SelectItem>
                                ))
                            }
                        </SelectGroup>

                    </SelectGroupContainer>
                </Select></div>
        </Stack>
    )
}

export default ModelSwitcher