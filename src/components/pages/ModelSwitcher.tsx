import {
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
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchModels} from "@/api/modelsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {fetchUserPreferences, updateUserPreferences} from "@/api/userPreferencesApi.ts";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import {useUserStore} from "@/store/userStore.ts";
import {useEffect} from "react";
import {useModelStore} from "@/store/useModelStore.ts";

const ModelSwitcher = ({className}: { className?: string }) => {
    const {renderToastContainer} = useToast();
    const updateSelectedModel = useModelStore(state => state.updateSelectedModel)
    const user = useUserStore(state => state.user)
    const queryClient = useQueryClient()
    const updateModels = useModelStore(state => state.updateModels)
    const updateVisionModels = useModelStore(state => state.updateVisionModels)

    const {data: models, error: modelsError, isLoading: isFetchingModels, isSuccess} = useQuery({
        queryFn: () => fetchModels(),
        queryKey: [queryKeys.modelList]
    })

    const {data: visionModels, error: visionModelsError, isSuccess: isVisionModelFetched} = useQuery({
        queryFn: () => fetchModels(false, 'vision'),
        queryKey: [queryKeys.visionModelList]
    })


    const {data: userPreferences, isLoading: isFetchingUserPreferences, error: userPreferencesError} = useQuery({
        enabled: !!user.id,
        queryFn: () => fetchUserPreferences(user.id),
        queryKey: [queryKeys.userPreferences],
    })

    const {mutateAsync: updateUserPreferencesMutation} = useMutation({
        mutationFn: updateUserPreferences,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.userPreferences])
        }
    })


    const changeModel = async (model: string) => {
        updateSelectedModel(model);
        await updateUserPreferencesMutation({
            model,
            user_id: user.id,
        })
    }

    useEffect(() => {
        if (!isSuccess || !models) return
            updateModels(models)
    }, [isSuccess])

    useEffect(() => {
        if (!isVisionModelFetched || !visionModels) return
            updateVisionModels(visionModels)
    }, [isVisionModelFetched]);
    

    if (isFetchingUserPreferences || isFetchingModels)
        return <div className=" h-12 animate-pulse rounded-lg w-full bg-black/20 dark:bg-white/20"/>

    if (modelsError)
        return <ErrorUI error={modelsError as Error} onRetry={() => {
        }}/>

    return (
        <Stack className={className}>
            {renderToastContainer()}
            <div className={'flex flex-col items-start justify-start gap-1'}>
                <p className={'text-[12px] text-meta-fill-l-text-sec dark:text-meta-fill-d-text-sec'}>Select a model</p>
                <Select
                    variant={'fill'}
                    defaultValue={userPreferences!.model || 'llama3.2'}
                    className={''}
                    onChange={(e) => changeModel(e.target.value as string)}
                >
                    <SelectTrigger>
                        <SelectLabel placeholder={"Select a model"}/>
                        <ChevronDownIcon/>
                    </SelectTrigger>
                    <SelectGroupContainer>
                        <SelectGroup>
                            <SelectGroupTitle>{isFetchingModels ? 'Getting models' : 'Models'}</SelectGroupTitle>
                            {
                                (!modelsError && !isFetchingModels && models) && models?.map(model => (
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