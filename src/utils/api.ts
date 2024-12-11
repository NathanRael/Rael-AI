import axios from "axios";
import {BASE_URL} from "@/constants";
import {useAuthStore} from "@/store/authStore.ts";

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

