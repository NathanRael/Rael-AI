import axios from "axios";
import {BASE_URL} from "@/constants";
import {User} from "@/api/usersApi.ts";
axios.defaults.withCredentials = true;
export interface Token {
    access_token: string;
    token_type: string;
}


export const loginUser = async ({email, password} : Pick<User, 'email' | 'password'>) => {
    const response = await axios.post<Token>(`${BASE_URL}/api/login`, {email, password})
    
    if (response.status !== 200)
        throw new Error(response.statusText)
    return response.data
}

export const logout = async () => {
    return await axios.post(`${BASE_URL}/api/logout`, {})
}




export const fetchNewToken = async (token: string) => {
    const response = await axios.get<Token>(`${BASE_URL}/api/newToken`, {
        headers : {Authorization: `Bearer ${token}`}
    })
    
    if (response.status !== 200)
        throw new Error(response.statusText)
    
    return response.data;
}

export const refreshToken = async () => {
    const response = await axios.get<Token>(`${BASE_URL}/api/refreshToken`)

    if (response.status !== 200)
        throw new Error(response.statusText)

    // console.log("NewRefersh", response.data.access_token)
    
    return response.data;
}
