import {limitTextLen} from "@/utils/helpers.ts";
import {Trash2} from "lucide-react";
import {cn, Icon, Stack, useToast} from "rael-ui";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Conversation, deleteConversation} from "@/api/conversationsApi.ts";
import {useNavigate, useParams} from "react-router-dom";
import {queryKeys} from "@/api/queryKeys.ts";

const ChatHistory = ({name, id, active}: { name: string, id: string, active?: boolean }) => {
    const {chatId} = useParams();
    const navigate = useNavigate();
    const {toast, renderToastContainer} = useToast()
    const queryClient = useQueryClient();
    const {mutateAsync: deleteConversationMutation, isLoading: isDeletingConversation} = useMutation({
        mutationFn: deleteConversation,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.conversationList])
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({queryKey: [queryKeys.conversationList]})
            
            const previousConversation = queryClient.getQueryData([queryKeys.conversationList]);

            queryClient.setQueryData([queryKeys.conversationList], (old) =>
                (old as Conversation[])?.filter((conversation) => conversation.id !== id)
            );
            
            return {previousConversation}
        },
        
        onError: (error, id, context) => {
            queryClient.setQueryData([queryKeys.conversationList], context?.previousConversation);
        }
    })

    const handleNavigateToConversation = () => {
        if (isDeletingConversation)
            return

        navigate(`/chat/${id}`)
    }

    const handleDelete = async () => {
        if (chatId?.toString() === id.toString()) {
            navigate('/')
        }
        await deleteConversationMutation(id)
    }
    

    return (
        <Stack align={'start'} direction={'horizontal'}
               className={cn(' w-full p-3  rounded-xl  hover:bg-neutral-light-60 dark:hover:bg-neutral-dark-40 justify-between', active && 'bg-neutral-light-60 dark:bg-neutral-dark-40')}>
            {renderToastContainer()}
            <p onClick={handleNavigateToConversation}
               className={'text-md  text-nowrap text-black-100 dark:text-white-100 cursor-pointer hover:underline'}>{limitTextLen(name, 25)}</p>
            <Stack direction={'horizontal'} gap={8}>
                {/*<Icon variant={'ghost'} size={'sm'}> <Pencil size={16}/></Icon>*/}
                <Icon onClick={handleDelete} variant={'ghost'} size={'sm'}> <Trash2 size={16}/></Icon>
            </Stack>
        </Stack>
    )
}

export default ChatHistory;