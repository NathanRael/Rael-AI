import {User} from "@/api/usersApi.ts";
import {apiClient} from "@/utils/api";

export interface Token {
    access_token: string;
    token_type: string;
}


export const loginUser = async ({email, password}: Pick<User, 'email' | 'password'>) => {
    const response = await apiClient.post<Token>(`/api/login`, {email, password})
    return response.data
}

export const logout = async () => {
    return await apiClient.post(`/api/logout`, {})
}

export const refreshToken = async () => {
    const response = await apiClient.get<Token>(`/api/refreshToken`)
    return response.data;
}
