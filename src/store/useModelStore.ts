import {create} from "zustand";

type ModelStore = {
    models : string[];
    selectedModel : string;
    visionModels : string[];
    updateModels : (models : string[]) => void;
    updateVisionModels : (models : string[]) => void;
    updateSelectedModel : (model : string) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
    models : [],
    visionModels : [],
    selectedModel : "",
    updateModels : models => set({models : models}),
    updateVisionModels : models => set({visionModels : models}),
    updateSelectedModel : (model : string) => set({selectedModel : model}),
}))