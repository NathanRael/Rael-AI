import axios from "axios";
import {BASE_URL} from "@/constants";
import {api} from "@/utils/api.ts";
import {BackendErrorResponse} from "@/api/baseApi.ts";


export interface User {
    id : string,
    username : string,
    email : string,
    password?: string,
}

export const fetchActiveUser = async () => {

    try {
        
        const response = await api.get<User>(`api/me`);
        
        if (response.status !== 200)
            new Error(response.statusText);
        return response.data;
    }catch (e){
        console.error(`Error while fetching active user : ${(e as BackendErrorResponse).response.data.detail}`);
    }
    
}

export const createUser = async ({email, password, username} : Omit<User, 'id'>) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users`, {email, password, username});

        if (response.status !== 200)
            new Error(response.statusText);

        return response.data;
    } catch (error) {
        console.error(`Error while creating user : ${error}`);
    }
}

export const fetchMe = async (token : string) => {
    return axios.get<User>(`${BASE_URL}/api/me`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}

export const updateUser = async (user : Partial<User>) => {
    try {
        const response = await api.put<User>(`api/users/${user.id}`, user);

        if (response.status !== 200)
            throw new Error(response.statusText);

        return response.data;
    } catch (error) {
        console.error(`Error while updating user : ${error}`);
    }
}