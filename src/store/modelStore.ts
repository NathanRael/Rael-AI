import {create} from "zustand";
import {Model} from "@/api/modelsApi.ts";

type useModelStore = {
    models : string[];
    formatedModels : Model[];
    selectedModel : string;
    visionModels : Model[];
    updateModels : (models : string[]) => void;
    updateVisionModels : (models : Model[]) => void;
    updateSelectedModel : (model : string) => void;
    updateFormatedModels : (models : Model[]) => void;
}

const initialState: Pick<useModelStore, 'formatedModels' | 'selectedModel' | 'models' | 'visionModels'> = {
    models : [],
    formatedModels : [],
    selectedModel : '',
    visionModels : [],
}

export const useModelStore = create<useModelStore>((set) => ({
    ...initialState,
    updateModels : models => set({models : models}),
    updateVisionModels : models => set({visionModels : models}),
    updateSelectedModel : model  => set({selectedModel : model}),
    updateFormatedModels : models => set({formatedModels : models}),
}))