import {Outlet, useNavigate} from "react-router-dom";
import {useLayoutEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchActiveUser} from "@/api/usersApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useUserStore} from "@/store/userStore.ts";
import {useAuthStore} from "@/store/authStore.ts";
import {api} from "@/utils/api.ts";
import {refreshToken} from "@/api/authApi.ts";

const AuthLayout = () => {
    const token = useAuthStore(state => state.token)
    const navigate = useNavigate();
    const updateUser = useUserStore(state => state.updateUser)

    const {data: user, isError, isSuccess, isLoading} = useQuery({
        queryFn: fetchActiveUser,
        queryKey: [queryKeys.activeUser],
    })


    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use((config) => {
            if (token)
                config.headers.Authorization = `Bearer ${token}`
            return config;
        })

        return () => api.interceptors.request.eject(authInterceptor)
    }, [token]);

    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const {access_token: accessToken} = await refreshToken();
                    if (accessToken) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
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
            return console.log('Login out')
        }

        if (isSuccess && user && !isLoading) 
            updateUser(user)


    }, [user, isError, navigate, isSuccess, isLoading])
    


    return (
        <section>
            <Outlet/>
        </section>
    )
}

export default AuthLayout