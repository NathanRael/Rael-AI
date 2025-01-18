/*
*  Hook for intercepting requests
* */
import {useLayoutEffect} from "react";
import {api, apiClient} from "@/utils/api.ts";
import {InternalAxiosRequestConfig} from "axios";
import {refreshToken} from "@/api/authApi.ts";
import {useAuthStore} from "@/store/authStore.ts";
import {useConnection} from "@/hooks/useConnection.ts";

export const useRequestInterceptor = () => {
    const {updateToken, token} = useAuthStore();
    const {serverUrl, updateServerUrl} =  useConnection()
    
    const updateBaseUrl = (config : InternalAxiosRequestConfig<any>) => {
        config.baseURL = serverUrl;
        
        return config;
    }
    
    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = !(config as any)._retry && token ? `Bearer ${token}` : config.headers.Authorization;
            return updateBaseUrl(config);
        })

        const clientInterceptor = apiClient.interceptors.request.use( (config) => {
            return updateBaseUrl(config);
        })

        
        return () => {
            api.interceptors.request.eject(authInterceptor)
            apiClient.interceptors.request.eject(clientInterceptor)
        }
    }, [token, serverUrl, updateServerUrl]);



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
    
}