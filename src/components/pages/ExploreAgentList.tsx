import {cn, Icon} from "rael-ui"
import {ChatbotType} from "@/api/chatbotTypesApi.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import useChatType from "@/components/pages/useChatType.ts";
import {Sparkles} from "lucide-react";

type ExploreChatbotTypeProps = {
    loading: boolean;
    error: Error;
    chatbotTypes: Omit<ChatbotType, 'context'>[];
    onRetry: () => void;
    className? : string;
}
const ExploreAgentList = ({loading, error, chatbotTypes, onRetry, className}: ExploreChatbotTypeProps) => {
    const {selectedId, handleSelect} = useChatType();


    if (loading)
        return <LoaderUI/>;

    if (error)
        return <ErrorUI error={error} onRetry={onRetry}/>
    if (chatbotTypes.length === 0)
        return <p className={'text-black text-center text-lead dark:text-white'}>No chatbot types found</p>


    return (
        <div
            className={cn('grid grid-cols-2 mx-auto gap-10 w-fit pb-40 max-[1574px]:grid-cols-2 max-[1160px]:grid-cols-2 max-md:grid-cols-1', className)}
        >

            {
                chatbotTypes?.map((chatbotType) => (
                    <ChatbotCard  {...chatbotType}
                                 selected={selectedId === chatbotType.id}
                                 onClick={(id) => handleSelect(id)} key={chatbotType.id}/>
                ))
            }
        </div>

    )
}

export default ExploreAgentList

type ChatbotCardProps = Omit<ChatbotType, 'context'> & {
    description: string;
    selected: boolean;
    onClick?: (id: string) => void;
    className?: string;
}

const ChatbotCard = ({
                         id, name, description, selected, onClick = () => {
    }, className
                     }: ChatbotCardProps) => {

    return (
        <div onClick={() => onClick(id)}
             className={cn("flex  text-base relative cursor-pointer hover:bg-neutral-light-80 dark:hover:bg-neutral-dark-80 flex-row gap-4 border border-neutral-light-60 dark:border-neutral-dark-80 rounded-xl p-6", selected && "bg-neutral-light-80 dark:bg-neutral-dark-80", className)}>
            <Icon variant={'secondary'} className={'max-md:hidden h-11'}>
                <Sparkles size={20}/>
            </Icon>
            <div>
                <p className={'font-md text-black-100 dark:text-white-100'}>{name}</p>
                <p className={' text-small text-black-80 dark:text-white/80'}>{description}</p>
            </div>
        </div>

    )
}