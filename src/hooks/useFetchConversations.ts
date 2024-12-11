import {useQuery} from "@tanstack/react-query";
import {ConversationFilters, fetchConversations} from "@/api/conversationsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {USER_ID} from "@/constants";
import {useUserStore} from "@/store/userStore.ts";

type UseFetchConversationsProps =  {
    // enabled?: boolean;
    // userId?: ConversationFilters["userId"];
    search? : ConversationFilters["search"];
}
const useFetchConversations = ({search, } : UseFetchConversationsProps) => {
    const user = useUserStore(state => state.user)
    return useQuery(({
        enabled : !!user.id,
        queryFn: () => fetchConversations({search, userId : user.id}),
        queryKey: [queryKeys.conversationList, {search}],
    }))
}

export default useFetchConversations