import {create} from "zustand";

type UIStore = {
    showSidebar : boolean;
    showHeader : boolean;
    setShowSidebar : (value : boolean) => void;
    setShowHeader : (value : boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
   showSidebar : false,
    showHeader : true,
   setShowSidebar : (value : boolean) => set({showSidebar : value}), 
    setShowHeader : (value : boolean) => set({showHeader : value}),
}))