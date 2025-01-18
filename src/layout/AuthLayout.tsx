import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useLayoutEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchActiveUser} from "@/api/usersApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useUserStore} from "@/store/userStore.ts";
import {fetchUserPreferences} from "@/api/userPreferencesApi.ts";
import {useRequestInterceptor} from "@/hooks/useRequestInterceptor.ts";

const AuthLayout = () => {
    const navigate = useNavigate();
    const updateUser = useUserStore(state => state.updateUser)

    const {data: user, isError, isSuccess, isLoading} = useQuery({
        queryFn: fetchActiveUser,
        queryKey: [queryKeys.activeUser],
    })

    const {data: userPrefs, isLoading: isFetchingUserPrefs, isSuccess: isSuccessUserPrefs} = useQuery({
        enabled: !!user?.id,
        queryFn: () => fetchUserPreferences(user!.id),
        queryKey: [queryKeys.userPreferences],
    })
    
    useRequestInterceptor()
    

    useLayoutEffect(() => {
        if (isError) {
            navigate("/login", {replace: true});
            return console.log('LoginPage out')
        }

        if (isSuccess && user && !isLoading)
            updateUser(user)


    }, [user, isError, navigate, isSuccess, isLoading])

    useEffect(() => {
        if (isFetchingUserPrefs || !userPrefs) return
        if (!userPrefs.has_onboarded && isSuccessUserPrefs) navigate("/onboarding/downloadTool")
    }, [isFetchingUserPrefs, isSuccessUserPrefs, userPrefs])


    return (
        <section>
            <Outlet/>
        </section>
    )
}

export default AuthLayout