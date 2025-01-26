import {useModelStore} from "@/store/modelStore.ts";
import {useMemo} from "react";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {updateUserPreferences} from "@/api/userPreferencesApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {User} from "@/api/usersApi.ts";

export const useModelHandler = ({queryClient, user} : {queryClient : QueryClient, user : User}) => {
    const {models, formatedModels, updateSelectedModel, selectedModel} = useModelStore();
    const nonEmbeddingModels = useMemo(() => formatedModels.filter((model) => model.capability.toLowerCase() !== 'tools'), [formatedModels]);
    
    const {mutateAsync: updateUserPreferencesMutation} = useMutation({
        mutationFn: updateUserPreferences,
        onSuccess: async () => {
            await queryClient.invalidateQueries([queryKeys.userPreferences])
        }
    })

    const visionModels = useMemo(() => formatedModels.filter((model) => model.capability === 'vision'), [formatedModels]);
    const changeModel = async (model: string) => {
        updateSelectedModel(model);
        // console.log(`ChangeModel ==> Changing model to : ${model}`);
        await updateUserPreferencesMutation({
            model,
            user_id: user.id,
        })
    }

    
    return {
        changeModel, formatedModels, models, selectedModel, visionModels, nonEmbeddingModels
    }
}