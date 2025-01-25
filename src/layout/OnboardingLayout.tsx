import {Navigate, Outlet} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchUserPreferences} from "@/api/userPreferencesApi.ts";
import {useUserStore} from "@/store/userStore.ts";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import {queryKeys} from "@/api/queryKeys.ts";

const OnboardingLayout = () => {
    const user = useUserStore(state => state.user);

    const {data : userPreference, isLoading, error} = useQuery({
        enabled: !!user.id,
        queryFn : () => fetchUserPreferences(user.id),
        queryKey : [queryKeys.userPreferences]
    })
    
    
    if (isLoading || !userPreference)
        return 
    
    if (error)
        return <ErrorUI error={error as Error} onRetry={() => {}}/>
    
    
    return (
        userPreference.has_onboarded ? <Navigate to={'/'}/> : <Outlet/>
    );
};

export default OnboardingLayout;