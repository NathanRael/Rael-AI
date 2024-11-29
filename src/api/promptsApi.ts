import axios from "axios";
import {BASE_URL} from "@/constants";

export const generateMessage = async ({ prompt, model }: { prompt: string; model?: string }) => {
    try {
        const response = await axios.post<string>(`${BASE_URL}/api/prompts`, {
            prompt,
            model,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};