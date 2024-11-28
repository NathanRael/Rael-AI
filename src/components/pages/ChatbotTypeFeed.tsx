import {ChatbotType} from "@/api/chatbotTypesApi.ts";
import {CardSection, Card, CardDescription, CardTitle, Icon, cn, Badge} from "rael-ui";
import {Bot} from "lucide-react";
import {motion} from "framer-motion"
import {useEffect, useState} from "react";
import useWindowSize from "@/hooks/useWindowSize.ts";

type ChatbotTypeFeedProps = Omit<ChatbotType, 'context'> & {
    description: string;
    selected: boolean;
    onClick?: (id : string) => void;
    className? : string;
}

const MAX_DESC_LENGTH = 40;

const ChatbotTypeFeed = ({id, name, description, selected, onClick = () => {}, className}: ChatbotTypeFeedProps) => {
    // const showFullDesc = useRef<boolean>(false);
    const [showFullDesc, setShowFullDesc] = useState(selected);
    const {width} = useWindowSize();
    
    const maxCardHeight =  width <= 430 ? 'auto' : 180
    const minCardHeight = width <= 430 ? 'auto' : 140

    useEffect(() => {
        setShowFullDesc(selected);
    }, [selected]);
    
    return (
        <motion.div
            onClick={() => {
                // setShowFullDesc(!showFullDesc);
                onClick(id)
            }}
            animate={{
                height: showFullDesc ? maxCardHeight : minCardHeight,
                // minHeight : showFullDesc ? 180 : 140,
            }}
            transition={{duration: 0.3}}
        >
            <Card
                className={cn(
                    'flex flex-col overflow-hidden select-none cursor-pointer items-start justify-start gap-4 p-4 dark:border-secondary/20 shadow-sm bg-transparent h-full dark:bg-transparent relative rounded-xl w-[360px]'
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
                            `text-black dark:text-white font-bold  text-[18px]`,
                            ''
                        )}
                    >
                        {name}
                    </CardTitle></CardSection>
                <CardDescription className={'visible max-md:hidden'}>
                    {showFullDesc
                        ? description
                        : description?.slice(0, MAX_DESC_LENGTH) +
                        (description?.length >= MAX_DESC_LENGTH ? ' ...' : '')}
                </CardDescription>
            </Card>
        </motion.div>

    )
}

export default ChatbotTypeFeed