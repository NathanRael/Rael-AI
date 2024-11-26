import {cn, Button, Stack, Icon} from "rael-ui"
import {Plus, SidebarIcon} from "lucide-react";
import {useRef, useState} from "react";
import useOutsideClicked from "@/hooks/useOutsideClicked.ts";
import ConversationList from "@/components/pages/ConversationList.tsx";
import {useNavigate} from "react-router-dom";
import useFetchConversations from "@/hooks/useFetchConversations.ts";
import ConversationListFilters from "@/components/pages/ConversationListFilters.tsx";
import {ConversationFilters} from "@/api/conversationsApi.ts";


const Sidebar = ({className}: { className?: string }) => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const [search, setSearch] = useState<ConversationFilters['search']>();

    const {data: conversations, isLoading, error} = useFetchConversations({search})
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
            className={cn('sidebar', `${showSidebar ? 'translate-x-0' : '-translate-x-[340px]'}  ${className}`)}>
            <Icon onClick={() => setShowSidebar(prev => !prev)} className={'fixed left-[348px] top-4'}
                  variant={'ghost'}>
                <SidebarIcon/>
            </Icon>
            <Button onClick={() => navigate('/')} block size={'sm'}><Plus size={16}/> New chat </Button>
            <Stack className={'w-full h-full justify-start'} gap={24}>
                <ConversationListFilters onChange={(filters) =>
                    setSearch(filters.search)}/>
                <div className={'w-full space-y-7 '}>
                    <Stack className={'w-full'}>
                        <p className={'text-sm text-start w-full text-meta-fill-l-text-sec dark:text-meta-fill-d-text-sec'}>Chat
                            Type</p>
                        <Stack className={'w-full'} gap={8}>
                            {
                                Array.from({length: 3}, (_, index) => (<ChatType key={index}/>))
                            }
                        </Stack>
                    </Stack>
                    <Stack className={'w-full max-h-[520px] overflow-y-auto hide-scrollbar'}>
                        <p className={'text-sm text-start w-full text-meta-fill-l-text-sec dark:text-meta-fill-d-text-sec'}>Histories</p>
                        <ConversationList conversations={conversations!} error={error as any} loading={isLoading}/>
                    </Stack>
                </div>
            </Stack>
        </div>
    )
}

export default Sidebar

const ChatType = () => {
    return (
        <div className={' w-full h-10 rounded-xl bg-white/20'}></div>
    )
}

