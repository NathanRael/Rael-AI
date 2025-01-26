import axios, {AxiosInstance} from "axios";
import {BASE_URL} from "@/constants";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const backendError = error.response?.data?.detail || "An unknown error occurred";
        console.log("Global Axios Error Interceptor:", backendError);

        console.error("Axios Error Details:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });

        return Promise.reject(error);
    }

    console.error("Unexpected Error:", error);
    return Promise.reject({message: "An unexpected error occurred", error});
};



const attachResponseInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        handleAxiosError
    );
};

attachResponseInterceptor(apiClient);
attachResponseInterceptor(api);

export {api, apiClient};