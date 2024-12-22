import {ChatbotType} from "@/api/chatbotTypesApi.ts";
import {cn} from "rael-ui";
import {limitTextLen} from "@/utils/helpers.ts";

type ChatbotTypeFeedProps = Omit<ChatbotType, 'context'> & {
    description: string;
    selected: boolean;
    onClick?: (id : string) => void;
    className? : string;
}

// const MAX_DESC_LENGTH = 40;

const ChatbotTypeCard = ({id, name, description, selected, onClick = () => {}, className}: ChatbotTypeFeedProps) => {

    return (
        <div onClick={() => onClick(id)} className={cn("flex text-base cursor-pointer hover:bg-neutral-light-80 dark:hover:bg-neutral-dark-80 flex-col gap-1 border border-neutral-light-60 dark:border-neutral-dark-80 rounded-xl p-4", selected && "bg-neutral-light-80 dark:bg-neutral-dark-80", className)}>
            <p className={'font-md text-black-100 dark:text-white-100'}>{name}</p>
            <p className={' text-small text-black-80 dark:text-white/80'}>{limitTextLen(description)}</p>
        </div>
    )
}

export default ChatbotTypeCard