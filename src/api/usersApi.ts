import axios from "axios";
import {BASE_URL} from "@/constants";
import {api} from "@/utils/api.ts";

interface Options {
    email? : string,
    id? : string,
}

export interface User {
    id : string,
    username : string,
    email : string,
    password?: string,
}
export const fetchUsers = async (options?: Options) => {
    // const response = await axios.get<User[]>(`${BASE_URL}/api/me`)
    const response = await axios.get<User[]>(`${BASE_URL}/api/users`)

    return response.data;
}


export const fetchActiveUser = async () => {

    try {
        
        const response = await api.get<User>(`api/me`);
        
        if (response.status !== 200)
            throw new Error(response.statusText);
        return response.data;
    }catch (e){
        console.error(`Error while fetching active user : ${e.response.data.detail}`);
    }
    
}

export const fetchMe = async (token : string) => {
    return axios.get<User>(`${BASE_URL}/api/me`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}