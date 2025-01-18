import {BASE_URL} from "@/constants";
import {RefObject} from "react";
import {apiClient} from "@/utils/api.ts";

export interface OllamaModel {
    name: string;
    description: string;
    capability: string;
    link: string;
    sizes: string[];
    error?: string
}

export interface OllamaModelDownload {
    status: string;
    total: number;
    completed: number;
    digest: string;
}

interface Options {
    search: string;
}

export const fetchOllamaModels = async (options?: Options) => {
    const response = await apiClient.get<OllamaModel[]>(`/api/ollamaModels/?formated=true`, {})

    if (response.status !== 200)
        throw new Error(response.statusText);

    if (options?.search)
        return response.data.filter(model => model.name.toLowerCase().includes(options.search!.toLowerCase()) || model.description.toLowerCase().includes(options.search!.toLowerCase()) || model.sizes.some(size => size.toLowerCase().includes(options.search!.toLowerCase()))
            || model.capability.toLowerCase().includes(options.search!.toLowerCase()));
    

    return response.data;
}

export const downloadOllamaModels = async ({onchange, model_name, abortController}:
                                               {
                                                   onchange: (chunk: OllamaModelDownload) => void,
                                                   model_name: string,
                                                   abortController: RefObject<AbortController>
                                               }) => {
    const response = await fetch(`${BASE_URL}/api/ollamaModels/download`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({model_name: model_name}),
        signal: abortController?.current?.signal
    })

    if (!response.body)
        throw new Error('No response body available.');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        const chunk: OllamaModelDownload = JSON.parse(decoder.decode(value, {stream: true}));
        // console.log(chunk)
        onchange(chunk)
    }

}