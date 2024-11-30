import {CardSection, Card, CardDescription, CardTitle, Icon, cn, Badge, Stack,Button} from "rael-ui"
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
}
const ExploreChatbotTypeList = ({loading, error, chatbotTypes, onRetry}: ExploreChatbotTypeProps) => {
    const {selectedId, handleSelect} = useChatType();


    if (loading)
        return <LoaderUI />;

    if (error)
        return <ErrorUI error={error} onRetry={onRetry}/>


    return (
            <div className={'grid grid-cols-4 mx-auto gap-4 w-fit pb-40 max-[1574px]:grid-cols-3 max-[1160px]:grid-cols-2 max-md:grid-cols-1'}
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
    }, className
                     }: ChatbotCardProps) => {

    return (
        <Card
            className={cn(
                'flex flex-col overflow-hidden   items-start justify-start gap-10 p-4 dark:border-secondary/20 shadow-sm bg-transparent h-fit dark:bg-transparent relative rounded-xl w-[360px]'
                , className)}
        >
            <Icon
                size={'lg'}
                className={`${
                    selected ? 'bg-secondary/80' : 'bg-secondary/40'
                } absolute -top-5 -right-5 -z-10`}
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
                </CardSection>
                <CardDescription className={'visible max-md:hidden'}>
                    {description}
                </CardDescription></CardSection>
            <Stack gap={8} align={'start'}>
                <p className={'text-black/80 dark:text-white text-small'}>Best with</p>
                <div className={'flex items-center justify-center gap-2'}>
                    <Badge size={'sm'} className={'bg-black/20 dark:bg-white/10'}>llama3.2</Badge>
                    <Badge size={'sm'} className={'bg-black/20 dark:bg-white/10'}>llava</Badge>
                </div>
            </Stack>
            <Button size={'sm'}  onClick={() => onClick(id)} variant={'primary'}>{selected ? 'Selected' : 'Select'}</Button>
        </Card>

    )
}