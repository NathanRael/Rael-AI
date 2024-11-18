import {limitTextLen} from "@/utils/helpers.ts";
import {Pencil, Trash2} from "lucide-react";
import {Icon, Stack } from "rael-ui";

const ChatHistory = ({name, id, onClick}: { name: string, id : string, onClick : () => void }) => {
    return (
           <Stack onClick={onClick} align={'start'} direction={'horizontal'}
                  className={' w-full p-3  rounded-xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 justify-between'}>
               <p className={'text-md text-meta-fill-l-text-sec dark:text-meta-fill-d-text-sec'}>{limitTextLen(name)}</p>
               <Stack direction={'horizontal'} gap={8}>
                   <Icon variant={'ghost'} size={'sm'}> <Pencil size={16}/></Icon>
                   <Icon variant={'ghost'} size={'sm'}> <Trash2 size={16}/></Icon>
               </Stack>
           </Stack>
    )
}

export default ChatHistory;