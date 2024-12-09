import {create} from "zustand";

type AuthStore = {
    token: string | null;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
    token : null,
    isAuthenticated : false,
    
    updateToken : (newToken : AuthStore["token"]) => {
        set({token: newToken });
    },
    updateAuth : (newAuthenticated : AuthStore["isAuthenticated"]) => {
        set({isAuthenticated: newAuthenticated });
    }
}))