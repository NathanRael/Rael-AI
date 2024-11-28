import {useQuery} from "@tanstack/react-query";
import {ConversationFilters, fetchConversations} from "@/api/conversationsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {USER_ID} from "@/constants";

type UseFetchConversationsProps =  {
    enabled?: boolean;
    // userId?: ConversationFilters["userId"];
    search? : ConversationFilters["search"];
}
const useFetchConversations = ({enabled, search} : UseFetchConversationsProps) => {
    return useQuery(({
        enabled,
        queryFn: () => fetchConversations({search, userId : USER_ID}),
        queryKey: [queryKeys.conversationList, {search}],
    }))
}

export default useFetchConversations