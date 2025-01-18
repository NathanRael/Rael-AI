import {useConnectionStore} from "@/store/connectionStore.ts";

export const useConnection = () => {
    
    return useConnectionStore()
}