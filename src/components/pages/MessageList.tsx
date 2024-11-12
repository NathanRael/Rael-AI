import MessageFeed, {MessageFeedProps} from "@/components/pages/MessageFeed.tsx";
import {Stack, Button} from "rael-ui"
import {INPUT_WIDTH} from "@/constants/style.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import {useChatContext} from "@/context/ChatProvider.tsx";
import {Info} from "lucide-react";

type MessageListProps = {
    conversations: MessageFeedProps[];
    loading?: boolean;
    error?: string;
}
const MessageList = ({conversations, loading, error}: MessageListProps) => {
    const {fetchConversations} = useChatContext();
    if (loading)
        return <LoaderUI title={'Loading conversations ...'} />
    if (error)
        return (
            <Stack  gap={16}>
                <Stack className={'text-center text-danger'} direction={'horizontal'} gap={8}>
                    <Info/>
                    <p>{error}</p>
                </Stack>
                <Button variant={'secondary'} size={'sm'} radius={'2xl'} onClick={() => fetchConversations()} block>Retry</Button>
            </Stack>
        )
    return (
        <Stack direction={'vertical'} className={`max-md:w-full ${INPUT_WIDTH}`} gap={24}>
            {
                conversations?.map((conversation, index) => (<MessageFeed key={index} {...conversation}/>))
            }
        </Stack>
    )
}

export default MessageList