import {apiClient} from "@/utils/api.ts";

export const generateMessage = async ({ prompt, model }: { prompt: string; model?: string }) => {
    try {
        const response = await apiClient.post<string>(`/api/prompts`, {
            prompt,
            model,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};