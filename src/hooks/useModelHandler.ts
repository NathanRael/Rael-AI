import {useModelStore} from "@/store/modelStore.ts";
import {useMemo} from "react";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {updateUserPreferences} from "@/api/userPreferencesApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {User} from "@/api/usersApi.ts";

export const useModelHandler = ({queryClient, user} : {queryClient : QueryClient, user : User}) => {
    const models = useModelStore((state) => state.models);
    const formatedModels = useModelStore((state) => state.formatedModels);
    const updateSelectedModel = useModelStore((state) => state.updateSelectedModel);
    // const selectedModel = useModelStore(state => state.selectedModel);
    const selectedModel = useModelStore((state) => state.selectedModel);
    
    


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
        changeModel, formatedModels, models, selectedModel, visionModels
    }
}