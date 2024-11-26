import {useQuery} from "@tanstack/react-query";
import {ConversationFilters, fetchConversations} from "@/api/conversationsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";

type UseFetchConversationsProps = ConversationFilters & {
    enabled?: boolean;
}
const useFetchConversations = ({enabled, search} : UseFetchConversationsProps) => {
    return useQuery(({
        enabled,
        queryFn: () => fetchConversations({search}),
        queryKey: [queryKeys.conversationList, {search}],
    }))
}

export default useFetchConversations