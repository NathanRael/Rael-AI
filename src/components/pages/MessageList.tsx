import MessageContent from "@/components/pages/MessageContent.tsx";
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
    
    if (loading)
        return <LoaderUI className={'flex items-center justify-center  w-full'} title={'Loading conversations ...'} />
    
    if (error)
        return (
            <Stack  gap={16} className={'w-full'}>
                <Stack className={'text-center text-danger'} direction={'horizontal'} gap={8}>
                    <Info/>
                    <p className={'text-danger text-sm'}>Error : {error?.message}</p>
                </Stack>
                <Button variant={'secondary'} size={'sm'} radius={'2xl'} onClick={() => {}} block>Retry</Button>
            </Stack>
        )
    
    return (
        <Stack direction={'vertical'} className={`max-md:w-full ${INPUT_WIDTH}`} gap={64}>
            {
                messages?.map((message) => (<MessageContent key={message.id} {...message}/>))
            }
        </Stack>
    )
}

export default MessageList