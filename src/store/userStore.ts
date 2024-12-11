import {User} from "@/api/usersApi.ts";
import {create} from "zustand";

type UserStore = {
    user : User;
    updateUser : (user : User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user : {} as User,
    updateUser : user => set({user : user}),
}))