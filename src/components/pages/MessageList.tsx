import MessageFeed from "@/components/pages/MessageFeed.tsx";
import {Stack, Button} from "rael-ui"
import {INPUT_WIDTH} from "@/constants/style.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import {Info} from "lucide-react";
import {Message} from "@/api/MessagesApi.ts";

type MessageListProps = {
    messages: Message[];
    loading?: boolean;
    error?: {
        message: string;
    };
}
const MessageList = ({messages, loading, error}: MessageListProps) => {
    
    if (loading && !error?.message)
        return <LoaderUI title={'Loading conversations ...'} />
    
    if (error)
        return (
            <Stack  gap={16}>
                <Stack className={'text-center text-danger'} direction={'horizontal'} gap={8}>
                    <Info/>
                    <p className={'text-danger text-sm'}>Error : {error?.message}</p>
                </Stack>
                <Button variant={'secondary'} size={'sm'} radius={'2xl'} onClick={() => {}} block>Retry</Button>
            </Stack>
        )
    
    return (
        <Stack direction={'vertical'} className={`max-md:w-full ${INPUT_WIDTH}`} gap={24}>
            {
                messages?.map((message) => (<MessageFeed key={message.id} {...message}/>))
            }
        </Stack>
    )
}

export default MessageList