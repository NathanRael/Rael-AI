import {create} from "zustand";
import {persist} from "zustand/middleware";


type ConnectionStore = {
    serverUrl: string;
    updateServerUrl: (serverUrl: string) => void;
}


export const useConnectionStore = create<ConnectionStore>()(
    persist(
        (set) => ({
            serverUrl : "http://localhost:8000",
            updateServerUrl : (serverUrl: string) => set({serverUrl: serverUrl}),
        }),
        {name: 'serverUrl', partialize: state => ({serverUrl: state.serverUrl})},
    ),
)
