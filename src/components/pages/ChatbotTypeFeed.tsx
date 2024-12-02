import {ChatbotType} from "@/api/chatbotTypesApi.ts";
import {CardSection, Card, CardDescription, CardTitle, Icon, cn, Badge} from "rael-ui";
import {Bot} from "lucide-react";
import {motion} from "framer-motion"

type ChatbotTypeFeedProps = Omit<ChatbotType, 'context'> & {
    description: string;
    selected: boolean;
    onClick?: (id : string) => void;
    className? : string;
}

// const MAX_DESC_LENGTH = 40;

const ChatbotTypeFeed = ({id, name, description, selected, onClick = () => {}, className}: ChatbotTypeFeedProps) => {

    return (
        <motion.div
            onClick={() => {
                onClick(id)
            }}
            transition={{duration: 0.3}}
        >
            <Card
                className={cn(
                    'flex flex-col cursor-pointer overflow-hidden dark:border-none items-start justify-start gap-3 p-4  shadow-sm bg-meta-fill-l-bg h-full dark:bg-white/5 relative rounded-xl w-[240px] max-md:w-[340px]'
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
                            `text-black dark:text-white  text-base`,
                            ''
                        )}
                    >
                        {name}
                    </CardTitle>
                </CardSection>
                <CardDescription>
                    {/*{showFullDesc*/}
                    {/*    ? description*/}
                    {/*    : description?.slice(0, MAX_DESC_LENGTH) +*/}
                    {/*    (description?.length >= MAX_DESC_LENGTH ? ' ...' : '')}*/}
                    {
                        description
                    }
                </CardDescription>
            </Card>
        </motion.div>

    )
}

export default ChatbotTypeFeed