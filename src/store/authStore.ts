import {create} from "zustand";

type AuthStore = {
    token: string | null;
    isAuthenticated: boolean;
    updateToken : (newToken : AuthStore['token']) => void;
    updateAuth : (isAuth: AuthStore['isAuthenticated']) => void;
    
}

export const useAuthStore = create<AuthStore>((set) => ({
    token : null,
    isAuthenticated : false,
    updateToken : (newToken : AuthStore["token"]) => {
        set({token: newToken });
    },
    updateAuth : (isAuth : AuthStore["isAuthenticated"]) => {
        set({isAuthenticated: isAuth });
    }
}))