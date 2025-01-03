import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useLayoutEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchActiveUser} from "@/api/usersApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useUserStore} from "@/store/userStore.ts";
import {useAuthStore} from "@/store/authStore.ts";
import {api} from "@/utils/api.ts";
import {refreshToken} from "@/api/authApi.ts";
import {fetchUserPreferences} from "@/api/userPreferencesApi.ts";

const AuthLayout = () => {
    const token = useAuthStore(state => state.token)
    const updateToken = useAuthStore(state => state.updateToken)
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
    

    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = !(config as any)._retry && token ? `Bearer ${token}` : config.headers.Authorization;
            return config;
        })

        return () => api.interceptors.request.eject(authInterceptor)
    }, [token]);

    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401) {
                    try {
                        const {access_token: accessToken} = await refreshToken();
                        updateToken(accessToken)

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        originalRequest._retry = true;

                        return api(originalRequest);
                    } catch (e) {
                        updateToken(null)
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => api.interceptors.request.eject(refreshInterceptor)
    }, []);

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
        if (!userPrefs.has_onboarded && isSuccessUserPrefs) navigate("/onboarding/chooseModel")
    }, [isFetchingUserPrefs, isSuccessUserPrefs, userPrefs])


    return (
        <section>
            <Outlet/>
        </section>
    )
}

export default AuthLayout