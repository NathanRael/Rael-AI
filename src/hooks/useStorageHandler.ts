import useLocalStorage from "@/hooks/useLocalStorage.ts";

export const useStorageHandler = () => {
    const storage = useLocalStorage();

    const getFromStorage = (key: string) => storage.getItem(key) || '';
    const setToStorage = (key: string, value: string) => storage.setItem(key, value);

    return {getFromStorage, setToStorage};
};
