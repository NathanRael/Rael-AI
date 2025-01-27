/*
*  Hook for intercepting requests
* */
import {useLayoutEffect} from "react";
import {api, apiClient} from "@/utils/api.ts";
import axios, {InternalAxiosRequestConfig} from "axios";
import {refreshToken} from "@/api/authApi.ts";
import {useAuthStore} from "@/store/authStore.ts";
import {useConnection} from "@/hooks/useConnection.ts";

export const useRequestInterceptor = () => {
    const {updateToken, token} = useAuthStore();
    const {serverUrl, updateServerUrl} = useConnection()

    const updateBaseUrl = (config: InternalAxiosRequestConfig) => {
        /* config.baseURL = serverUrl;*/
        return config;
    }

    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = !(config as any)._retry && token ? `Bearer ${token}` : config.headers.Authorization;
            return updateBaseUrl(config);
        })

        const clientInterceptor = apiClient.interceptors.request.use(updateBaseUrl)


        return () => {
            api.interceptors.request.eject(authInterceptor)
            apiClient.interceptors.request.eject(clientInterceptor)
        }
    }, [token, serverUrl, updateServerUrl]);


    useLayoutEffect(() => {
        const handleAxiosError = (error: unknown) => {
            if (axios.isAxiosError(error)) {
                const backendError = error.response?.data?.detail || "An unknown error occurred";
                console.error("Axios Error:", backendError, error.config);
            }
            console.error("Unexpected Error:", error);
            return Promise.reject(error);
        };

        const apiClientErrorInterceptor = apiClient.interceptors.response.use(
            (res) => res,
            handleAxiosError
        );

        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const {access_token : newToken} = await refreshToken();
                        
                        updateToken(newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        updateToken(null);
                        return Promise.reject(refreshError);
                    }
                }
                
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(refreshInterceptor);
            apiClient.interceptors.response.eject(apiClientErrorInterceptor);
        };
    }, [updateToken]);

}