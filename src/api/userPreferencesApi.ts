import {apiClient} from "@/utils/api";


export interface UserPreference {
    id : string;
    theme : string;
    chatbot_type_id : string;
    user_id : string;
    model : string;
    main_chatbot_types?: string[];
    has_onboarded?: boolean;
}

export const fetchUserPreferences = async (userId : string) => {
    const response = await apiClient.get<UserPreference>(`/api/userPreferences/${userId}`);
    return response.data;
}


export const updateUserPreferences = async (options : Partial<Omit<UserPreference, 'id'>>) => {
    const response = await apiClient.patch(`/api/userPreferences/${options.user_id}`, {
        theme : options.theme,
        chatbot_type_id : options.chatbot_type_id,
        model : options.model,
        main_chatbot_types : options.main_chatbot_types,
        has_onboarded : options.has_onboarded
    })
    
    return response.data;
}