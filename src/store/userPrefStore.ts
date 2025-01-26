import {create} from 'zustand'
import {persist} from 'zustand/middleware'

type UserPrefStore = {
    selectedModel: string;
    darkMode: boolean;
    hasOnboarded : boolean;
    updateSelectedModel: (selectedModel: string) => void;
    setHasOnboarded: (hasOnboarded: boolean) => void;
    updateDarkMode: (darkMode: boolean) => void;
    toggleDarkMode: () => void;
}

export const useUserPrefStore = create<UserPrefStore>()(
    persist(
        (set) => ({
            darkMode: false,
            hasOnboarded: false,
            selectedModel: '',
            setHasOnboarded: (hasOnboarded) => set({hasOnboarded}),
            updateSelectedModel: (selectedModel) => set({selectedModel}),
            updateDarkMode: (value) => set({darkMode: value}),
            toggleDarkMode: () => set((state) => ({darkMode: !state.darkMode})),
        }),
        {name: 'darMode', partialize: state => ({darkMode: state.darkMode}),},
    ),
)