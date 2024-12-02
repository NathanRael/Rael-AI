import {CardSection, Card, CardDescription, CardTitle, Icon, cn, Badge, Stack, Button} from "rael-ui"
import {ChatbotType} from "@/api/chatbotTypesApi.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import useChatType from "@/components/pages/useChatType.ts";
import {Bot} from "lucide-react";

type ExploreChatbotTypeProps = {
    loading: boolean;
    error: Error;
    chatbotTypes: Omit<ChatbotType, 'context'>[];
    onRetry: () => void;
    className? : string;
}
const ExploreChatbotTypeList = ({loading, error, chatbotTypes, onRetry, className}: ExploreChatbotTypeProps) => {
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
                    <ChatbotCard {...chatbotType}
                                 selected={selectedId === chatbotType.id}
                                 onClick={(id) => handleSelect(id)} key={chatbotType.id}/>
                ))
            }
        </div>

    )
}

export default ExploreChatbotTypeList

type ChatbotCardProps = Omit<ChatbotType, 'context'> & {
    description: string;
    selected: boolean;
    onClick?: (id: string) => void;
    className?: string;
}

const ChatbotCard = ({
                         id, name, description, selected, onClick = () => {
    }, className, suggested_models
                     }: ChatbotCardProps) => {

    return (
        <Card
            className={cn(
                'flex flex-col overflow-hidden dark:border-none items-start justify-start gap-6 p-4  shadow-sm bg-meta-fill-l-bg h-fit dark:bg-white/5 relative rounded-xl w-[480px] max-md:w-full'
                , className)}
        >
            <Icon
                size={'lg'}
                className={`${
                    selected ? 'bg-secondary/80' : 'bg-secondary/40'
                } absolute -top-5 -right-5 `}
            >
                <Bot size={32}/>
            </Icon>
            <CardSection className={'gap-2'}>
                <CardSection rFor={'meta'}>

                    <Badge
                        size={'sm'}
                        className={
                            `bg-secondary ${selected ? 'opacity-1 ' : 'opacity-0 hover:opacity-0'} `
                        }
                    >
                        Active
                    </Badge>

                    <CardTitle
                        className={cn(
                            `text-black dark:text-white font-bold  text-lead`,
                            ''
                        )}
                    >
                        {name}
                    </CardTitle>
                    <CardDescription className={''}>
                        {description}
                    </CardDescription>
                </CardSection>
                
            </CardSection>
            <Stack gap={8} align={'start'}>
                <p className={'text-black/80 dark:text-white text-small'}>Best with</p>
                <div className={'flex items-center justify-center gap-2'}>
                    {
                        suggested_models.split(',')?.map(suggestedModel => (
                            <Badge size={'sm'} className={'bg-primary/70 dark:bg-primary/50'}>{suggestedModel}</Badge>

                        ))
                    }
                </div>
            </Stack>
            <Button size={'sm'} onClick={() => onClick(id)}
                    className={'button-gradient'}>{selected ? 'Selected' : 'Select chatbot type'}</Button>
        </Card>

    )
}