
const useLocalStorage = () => {
    
    const setItem = (key: string, value: string) => {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    const getItem = (key: string) => {
        return JSON.parse(localStorage.getItem(key) || '')
    }
    
    const removeItem = (key: string) => {
        localStorage.removeItem(key)
    }
    
    return {
        setItem,
        getItem,
        removeItem,
    }
}

export default useLocalStorage