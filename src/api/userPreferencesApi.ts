import {BASE_URL} from "@/constants";
import axios from "axios";


export interface UserPreference {
    id : string;
    theme : string;
    chatbot_type_id : string;
    user_id : string;
    model : string
}

export const fetchUserPreferences = async (userId : string) => {
    const response = await axios.get<UserPreference>(`${BASE_URL}/api/userPreferences/${userId}`);
    
    return response.data;
}


export const updateUserPreferences = async (options : Partial<Omit<UserPreference, 'id'>>) => {
    const response = await axios.patch(`${BASE_URL}/api/userPreferences/${options.user_id}`, {
        theme : options.theme,
        chatbot_type_id : options.chatbot_type_id,
        model : options.model,
    })
    
    return response.data;
}