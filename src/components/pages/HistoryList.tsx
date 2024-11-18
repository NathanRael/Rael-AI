import ChatHistory from "@/components/pages/ChatHistory.tsx";
import {Stack} from "rael-ui";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import {useNavigate} from "react-router-dom";

type HistoryListProps = {
    histories: string[];
    loading: boolean;
    error: string;
}
const HistoryList = ({histories, loading, error}: HistoryListProps) => {
    const navigate = useNavigate();

    if (loading) 
        return <LoaderUI title={'Fetching histories'} />;
    
    if (error)
        return <p className={'text-danger text-sm'}>Error</p>
    
    return (
        <Stack className={'w-full'} gap={8}>
            {
                histories?.map((history) => (
                    <ChatHistory onClick={() => navigate(`/chat/${history}`)} id={history} name={history}
                                 key={history}/>))
            }
        </Stack>
    )
}

export default HistoryList