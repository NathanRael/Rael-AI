import {User} from "@/api/usersApi.ts";
import {apiClient} from "@/utils/api";

export interface Token {
    access_token: string;
    token_type: string;
}


export const loginUser = async ({email, password} : Pick<User, 'email' | 'password'>) => {
    const response = await apiClient.post<Token>(`/api/login`, {email, password})
    
    if (response.status !== 200)
        throw new Error("Error while login")
    return response.data
}

export const logout = async () => {
    return await apiClient.post(`/api/logout`, {})
}




export const fetchNewToken = async (token: string) => {
    const response = await apiClient.get<Token>(`/api/newToken`, {
        headers : {Authorization: `Bearer ${token}`}
    })
    
    if (response.status !== 200)
        throw new Error(response.statusText)
    
    return response.data;
}

export const refreshToken = async () => {
    const response = await apiClient.get<Token>(`/api/refreshToken`)

    if (response.status !== 200)
        throw new Error(response.statusText)

    // console.log("NewRefersh", response.data.access_token)
    
    return response.data;
}
