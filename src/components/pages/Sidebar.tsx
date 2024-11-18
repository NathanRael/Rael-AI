import {cn, Button, Stack, TextInput, Icon} from "rael-ui"
import {Plus, Search, SidebarIcon} from "lucide-react";
import {useRef, useState} from "react";
import useOutsideClicked from "@/hooks/useOutsideClicked.ts";
import HistoryList from "@/components/pages/HistoryList.tsx";
import useFetchHistories from "@/hooks/useFetchHistories.ts";


const Sidebar = ({className}: { className?: string }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const {histories, loading : isFetchingHistories, error : historiesError} = useFetchHistories();
    useOutsideClicked({
        ref : sidebarRef,
        action : () => {
            
        },
    });
    
    return (
        <div
            ref={sidebarRef}
            className={cn('sidebar', `${showSidebar ? 'translate-x-0' : '-translate-x-[340px]'}  ${className}`)}>
            <Icon onClick={() => setShowSidebar(prev => !prev)} className={'fixed left-[348px] top-4 py-6'} variant={'ghost'}>
                <SidebarIcon/>
            </Icon>
            <Button block size={'sm'}><Plus size={16}/> New chat </Button>
            <Stack className={'w-full h-full justify-start'} gap={24}>
                <TextInput block placeholder={'Search chat type or histories'}
                           leftContent={<Search size={16}/>}/>
                <div className={'w-full space-y-7 '}><Stack className={'w-full'}>
                    <p className={'text-sm text-start w-full text-meta-fill-l-text-sec dark:text-meta-fill-d-text-sec'}>Chat
                        Type</p>
                    <Stack className={'w-full'} gap={8}>
                        {
                            Array.from({length: 3}, (_, index) => (<ChatType key={index}/>))
                        }
                    </Stack>
                </Stack>
                    <Stack className={'w-full max-h-[520px] overflow-y-hidden'}>
                        <p className={'text-sm text-start w-full text-meta-fill-l-text-sec dark:text-meta-fill-d-text-sec'}>Histories</p>
                        <HistoryList histories={histories} error={historiesError} loading={isFetchingHistories} />
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

