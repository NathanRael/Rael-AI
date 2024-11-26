import {useQuery} from "@tanstack/react-query";
import {fetchConversations} from "@/api/conversationsApi.ts";

const useFetchConversations = ({enabled} : {enabled?: boolean}) => {
    return useQuery(({
        enabled,
        queryFn: fetchConversations,
        queryKey: ['conversations'],
    }))
}

export default useFetchConversations