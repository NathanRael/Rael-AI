import {
    Select,
    SelectGroup,
    SelectGroupContainer,
    SelectGroupTitle,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    Stack,
    useToast
} from "rael-ui"
import {ChevronDownIcon} from "lucide-react";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "@/constants";
import {useUserPrefContext} from "@/context/UserPrefProvider.tsx";

const ModelSwitcher = () => {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");
    const {renderToastContainer } = useToast();
    const {setSelectedModel} = useUserPrefContext();
     
    const getModels = async () => {
        setLoading(true);
        axios.get(`${BASE_URL}/api/models`).then(res => {
            if (res.status !== 200)
                new Error('Error while fetching models')
            // console.log('models : ', res.data.models)
            setModels(res.data.models);
        }).catch(e => {
            console.error(e);
            setError(e)
        }).finally(() => setLoading(false));  
    }
    
    const changeModel = async (model: string) => {
        setSelectedModel(model);
/*        toast({
            title: "Success",
            message: `Model changed to ${model}`,
        });*/
    }
    
    useEffect(() => {
        getModels()
    }, []);
    
    return (
        <Stack>
            {renderToastContainer()}
            <Select
                defaultValue={'llama3'}
                className={'w-fit'}
                onChange={(e) => changeModel(e.target.value as string)}
            >
                <SelectTrigger className={'bg-transparent  dark:bg-transparent'}>
                    <SelectLabel placeholder={"Select a model"}/>
                    <ChevronDownIcon/>
                </SelectTrigger>
                <SelectGroupContainer>
                    <SelectGroup>
                        <SelectGroupTitle>{loading ? 'Getting models' : 'Models'}</SelectGroupTitle>
                        {
                            !loading && !error && models.map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))
                        }
                    </SelectGroup>

                </SelectGroupContainer>
            </Select>
        </Stack>
    )
}

export default ModelSwitcher