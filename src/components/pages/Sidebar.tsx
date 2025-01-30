import {Button, cn, Icon, Stack} from "rael-ui"
import {Bot, Plus, SidebarIcon, SlackIcon} from "lucide-react";
import {useRef, useState} from "react";
import useOutsideClicked from "@/hooks/useOutsideClicked.ts";
import ConversationList from "@/components/pages/ConversationList.tsx";
import {useNavigate} from "react-router-dom";
import useFetchConversations from "@/hooks/useFetchConversations.ts";
import ConversationListFilters from "@/components/pages/ConversationListFilters.tsx";
import {ConversationFilters} from "@/api/conversationsApi.ts";
import {useQuery} from "@tanstack/react-query";
import {ChatbotType, fetchChatbotTypes} from "@/api/chatbotTypesApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import useChatType from "@/components/pages/useChatType.ts";

const Sidebar = ({className}: { className?: string }) => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const [search, setSearch] = useState<ConversationFilters['search']>();

    const {data: conversations, isLoading, error} = useFetchConversations({search});
    const {
        data: chatbotTypeList,
        isLoading: isFetchingChatbotType,
        error: chatbotTypeError,
        refetch: reFetchAgent
    } = useQuery({
        queryFn: () => fetchChatbotTypes({search}),
        queryKey: [queryKeys.chatbotTypeList, {search}]
    })
    useOutsideClicked({
        ref: sidebarRef,
        action: () => {
            // Hide the sidebar
            setShowSidebar(false)
        },
    });

    return (
        <div
            ref={sidebarRef}
            className={cn('sidebar  hide-scrollbar ', `${showSidebar ? 'translate-x-0' : '-translate-x-[340px]'}  ${className}`)}>
            <Icon onClick={() => setShowSidebar(prev => !prev)} className={'fixed left-[348px] top-4'}
                  variant={'ghost'}>
                <SidebarIcon/>
            </Icon>
            {/*<ModelSwitcher/>*/}
            <Button onClick={() => {
                navigate('/')
                setShowSidebar(false)
            }} block size={'sm'}><Plus size={16}/> New chat </Button>
            <Stack className={'w-full h-full justify-start pt-4   px-1 max-md:overflow-y-auto '} gap={24}>
                <ConversationListFilters onChange={(filters) =>
                    setSearch(filters.search)}/>
                <div className={'w-full space-y-7 '}>
                    <Stack align={'start'} className={'w-full'}>
                        <p className={'text-sm text-start w-full text-black-80 dark:text-white-80'}>AI Agents</p>
                        {
                            chatbotTypeList && <Agent className={'max-h-[240px] overflow-y-auto hide-scrollbar'}
                                                             chatbotTypes={chatbotTypeList?.slice(0, 3)}
                                                             loading={isFetchingChatbotType}
                                                             error={chatbotTypeError as Error}
                                                             onRetry={() => reFetchAgent()}/>
                        }
                        
                    </Stack>
                    <Stack className={'w-full  '}>
                        <p className={'text-sm text-start w-full text-black-80 dark:text-white-80'}>Histories</p>
                        <ConversationList className={'overflow-y-auto overflow-x-hidden hide-scrollbar  max-h-[320px]'}  conversations={conversations!} error={error as Error} loading={isLoading}/>
                    </Stack>
                </div>
            </Stack>
            {/*<Stack direction={'horizontal'} className={'w-full items-end justify-center'}>*/}
            {/*    <ThemeSwitcher className={''}/>*/}
            {/*</Stack>*/}
        </div>
    )
}

export default Sidebar


const Agent = ({loading, error, chatbotTypes, onRetry, className}: {
    loading: boolean,
    error: Error,
    chatbotTypes: ChatbotType[],
    onRetry: () => void,
    className?: string
}) => {
    const navigate = useNavigate();
    const {selectedId, handleSelect} = useChatType();
    
    if (loading)
        return <LoaderUI title={'Fetching conversation'}/>;

    if (error)
        return <ErrorUI error={error} onRetry={onRetry}/>

    return (
        <Stack className={cn('w-full', className)} gap={8} align={'start'}>
            {chatbotTypes.length === 0 &&
                <p className={'text-black-80 dark:text-white-80'}>No AI agent found</p>}
            {
                chatbotTypes.map(chat => (<ChatType onClick={() => handleSelect(chat.id)} selected={chat.id === selectedId} {...chat} key={chat.id}/>))
            }
            <Button onClick={() => navigate('/chat/explore')} className={'mt-2'} size={'sm'} variant={'ghost'} >
                <SlackIcon size={16}/>
                Explore AI agent
            </Button>
        </Stack>
    )
}
const ChatType = ({name, selected, onClick}: Omit<ChatbotType, 'description'> & {selected?: boolean, onClick: () => void}) => {
    return (
        <div
            onClick={onClick}
            className={cn('flex cursor-pointer items-center justify-start gap-2 w-full bg-transparent rounded-xl p-1 hover:bg-black/20 dark:hover:bg-neutral-dark-40', selected && 'bg-black/20 dark:bg-white/20')}>
            <Icon
                size={'sm'}
                className={`
                     ' hover:bg-transparent  dark:hover:bg-transparent dark:hover:text-white'
                 `}
                variant={'ghost'}
            >
                <Bot size={20}/>
            </Icon>
            <h1 className={'text-black-100 dark:text-white-100'}>{name}</h1>
        </div>
    )
}



