import {cn, Button, Stack, TextInput, Icon} from "rael-ui"
import {Pencil, Plus, Search, Trash2} from "lucide-react";
import {limitTextLen} from "@/utils/helpers.ts";



const Sidebar = ({className}: { className?: string }) => {
    return (
        <div
            className={cn('z-40 flex flex-col justify-between items-between  gap-10 fixed top-0 p-6 left-0 h-screen w-[340px] bg-meta-fill-l-bg border-meta-fill-l-border dark:border-meta-fill-d-border shadow-md dark:bg-meta-fill-d-bg', className)}>
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
                    <Stack className={'w-full'}>
                        <p className={'text-sm text-start w-full text-meta-fill-l-text-sec dark:text-meta-fill-d-text-sec'}>Histories</p>
                        <Stack className={'w-full'} gap={8}>
                            {
                                Array.from({length: 20}, (_, index) => (
                                    <ChatHistory name={`A really pretty long history name`} key={index}/>))
                            }
                        </Stack>
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

const ChatHistory = ({name}: { name: string }) => {

    return (
        <Stack align={'start'} direction={'horizontal'}
               className={' w-full p-3  rounded-xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/20'}>
            <p className={'text-md text-meta-fill-l-text-sec dark:text-meta-fill-d-text-sec'}>{limitTextLen(name)}</p>
            <Stack direction={'horizontal'} gap={8}>
                <Icon variant={'ghost'} size={'sm'}> <Pencil size={16}/></Icon>
                <Icon variant={'ghost'} size={'sm'}> <Trash2 size={16}/></Icon>
            </Stack>
        </Stack>
    )
}

