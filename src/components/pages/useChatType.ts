import useLocalSearchParams from "@/hooks/useLocalSearchParams.ts";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateUserPreferences} from "@/api/userPreferencesApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useUserStore} from "@/store/userStore.ts";

const useChatType = () => {
    const {updateSearchParam, getSearchParam} = useLocalSearchParams();
    const [selectedId, setSelectedId] = useState<string>(getSearchParam('chatType'));
    const location = useLocation();
    const user = useUserStore(state => state.user)
    const queryClient = useQueryClient();

    const {mutate : updateUserPreferencesMutation} = useMutation({
        mutationFn : updateUserPreferences,
        onSuccess : data => {
            queryClient.invalidateQueries([queryKeys.userPreferences])
        }
    })

    const handleSelect = ( id: string) => {
        updateSearchParam('chatType', id)
        setSelectedId(id)
        updateUserPreferencesMutation({
            chatbot_type_id : id,
            user_id : user.id,
        })
    }
    
    useEffect(() => {
        setSelectedId(getSearchParam('chatType'))
    }, [location])
    
    
    return {
        handleSelect,
        selectedId,
    }
}

export default useChatType