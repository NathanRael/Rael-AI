import axios from "axios";
import {BASE_URL} from "@/constants";

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
    const response = await axios.get<User[]>(`${BASE_URL}/api/users`)
    
    return response.data;
}