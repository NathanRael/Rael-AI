import axios from "axios";
import {User} from "@/api/usersApi.ts";
import {BASE_URL} from "@/constants";

export const LoginUser = async ({email, password} : Pick<User, 'email' | 'password'>) => {
    const response = await axios.post<string>(`${BASE_URL}/api/token`, {email, password})
    
    if (response.status !== 200)
        throw new Error(response.statusText)
    return response.data
}