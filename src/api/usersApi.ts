import axios from "axios";
import {BASE_URL} from "@/constants";
import {api} from "@/utils/api.ts";


export interface User {
    id: string,
    username: string,
    email: string,
    password?: string,
}

export const fetchActiveUser = async () => {
    const response = await api.get<User>(`api/me`);
    return response.data;
}

export const createUser = async ({email, password, username}: Omit<User, 'id'>) => {
    const response = await axios.post(`${BASE_URL}/api/users`, {email, password, username});
    return response.data;
}

export const fetchMe = async (token: string) => {
    return axios.get<User>(`${BASE_URL}/api/me`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}

export const updateUser = async (user: Partial<User>) => {
        const response = await api.put<User>(`api/users/${user.id}`, user);
        return response.data;
}