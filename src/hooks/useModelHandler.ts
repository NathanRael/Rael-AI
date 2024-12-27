import {useModelStore} from "@/store/modelStore.ts";
import {useMemo} from "react";

export const useModelHandler = () => {
    const models = useModelStore((state) => state.models);
    const formatedModels = useModelStore((state) => state.formatedModels);
    const updateSelectedModel = useModelStore((state) => state.updateSelectedModel);
    const selectedModel = useModelStore(state => state.selectedModel)

    const visionModels = useMemo(() => formatedModels.filter((model) => model.capability === 'vision'), [formatedModels]);
    
    
    return {
        updateSelectedModel, formatedModels, models, selectedModel, visionModels
    }
}