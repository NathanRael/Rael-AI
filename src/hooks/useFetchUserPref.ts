import {useQuery} from "@tanstack/react-query";
import {fetchUserPreferences} from "@/api/userPreferencesApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {User} from "@/api/usersApi.ts";

export const useFetchUserPref = (user : User | undefined) => {
    return useQuery({
        enabled: !!user?.id,
        queryFn: () => fetchUserPreferences(user!.id),
        queryKey: [queryKeys.userPreferences],
        // gcTime : 0,
    })
}