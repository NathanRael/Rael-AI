import {useSearchParams} from "react-router-dom";

const useLocalSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const getSearchParam = (key : string)=> {
        return searchParams.get(key) || ''
    }

    const updateSearchParam = (paramKey: string, newParamValue: string) => {
        setSearchParams({[paramKey]: newParamValue});
    };
    
    return {
        getSearchParam,
        updateSearchParam,
    }
}

export default useLocalSearchParams