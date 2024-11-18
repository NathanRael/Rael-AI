import axios from "axios";
import {BASE_URL} from "@/constants";
import {useCallback, useEffect, useState} from "react";


const useFetchHistories = () => {
    const [histories, setHistories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchHistories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/histories`, {signal});


            if (response.status !== 200)
                throw  new Error(`Error fetching histories`);
            
            const data = response.data.histories as string[];

            setHistories(data);
        }catch (e) {
            console.error(e);
            setError((e as any).message);
        } finally {
            setLoading(false);
        }

        /*        const timeOutId = setTimeout(() => {
                    abortController.abort('Timeout');
                }, 5000)*/

        // return () => clearTimeout(timeOutId);
    }, []);


    useEffect(() => {
        fetchHistories();
    }, [])

    return {
        histories,
        loading,
        error,
        setHistories,
        fetchHistories
    }
}

export default useFetchHistories;