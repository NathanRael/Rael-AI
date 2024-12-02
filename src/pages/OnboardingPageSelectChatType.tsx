import {ChevronRight, Slack} from "lucide-react";
import {Badge, Button} from "rael-ui";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import {useMemo} from "react";
import Stepper from "@/components/ui/Stepper.tsx";
import {MainPageImageDark, MainPageImageLight, ChatPageImage} from "@/constants/images.ts";
import {ChatbotType, fetchChatbotTypes} from "@/api/chatbotTypesApi.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";

type ChatbotTypeSelectList = {
    error : Error;
    loading: boolean;
    chatbotTypes: ChatbotType[];
}
const OnboardingPageChooseModel = () => {
    const navigate = useNavigate();
    return (
        <section className="onboarding-page flex gap-6 h-screen w-full">
            <div className={"basis-1/2 flex flex-col gap-10 justify-between pb-[128px]"}>
                <SelectChatbotType/>
                <Stepper end={true} onNext={() => navigate('/')} onPrevious={() => navigate('/onboarding/chooseModel')} className={''}/>
            </div>
            <div
                className="basis-1/2   overflow-hidden p-2 rounded-2xl flex flex-col gap-2 justify-between relative">
                <img src={ChatPageImage} className={' border-black/10 dark:border-white/10 border-4  skew-x-2 object-cover rounded-xl overflow-hidden w-full object-top'}
                     alt={'Main chatbot page'}/>
                <div className={'relative border-black/10 dark:border-white/10 border-4 overflow-hidden -skew-x-2 rounded-xl '}>
                    <div className={'absolute w-full h-full bg-black/60'}/>
                    <img src={MainPageImageLight} className={'  object-cover rounded-xl overflow-hidden  w-full'}
                         alt={'Main chatbot page'}/>
                </div>
                {/*<img src={ChatPageImage} className={' object-contain rounded-xl overflow-hidden'} alt={'Chat page'}/>*/}
            </div>
        </section>
    );
};

export default OnboardingPageChooseModel;

const SelectChatbotType = () => {
    const navigate = useNavigate();
    const {
        data: chatbotTypes,
        error: chatbotTypeError,
        isLoading: isFetchingChatbotTypes,
        refetch: reFetchOllamaModels
    } = useQuery({
        queryFn: () => fetchChatbotTypes({}),
        queryKey: [queryKeys.chatbotTypeList]
    })

    const recommendedModel = useMemo(() => {
        if (isFetchingChatbotTypes || chatbotTypeError || !chatbotTypes)
            return []
        return chatbotTypes!

    }, [chatbotTypes])
    return (
        <div className=" flex flex-col gap-10 overflow-hidden">
            <div className={'max-w-[540px]'}>
                <h1 className={'text-black dark:text-white text-big-title font-bold'}>Select 3 chatbot types</h1>
                <p className={'text-lead text-black/80 dark:text-white/80'}>Select a model to download, the selected
                    model will be used by default in you chat.</p>
            </div>
            <div className={'flex flex-col gap-8 items-start rounded-xl '}>
                <div className={'space-y-4'}>
                    <h1 className={'text-lead text-black dark:text-white'}>Available Chatbot type</h1>
                    <ChatbotTypeSelectList chatbotTypes={recommendedModel} error={chatbotTypeError as Error} loading={isFetchingChatbotTypes}/>
                </div>
                {/*<Button onClick={() => navigate('/chat/explore')} size={'sm'} variant={'ghost'} radius={'xl'}>*/}
                {/*    <Slack size={16}/>*/}
                {/*    Explore other*/}
                {/*    <ChevronRight/>*/}
                {/*</Button>*/}
            </div>
        </div>
    )
}


const ChatbotTypeSelectList = ({chatbotTypes, loading, error} : ChatbotTypeSelectList) => {
    
    if (loading)
        return <LoaderUI/>
    
    if (error)
        return <ErrorUI error={error} onRetry={() => {}}/>
    
    return (
        <div className={'flex flex-row flex-wrap gap-4'}>
            {
                chatbotTypes.map(chatbotType => (<Badge className={'bg-primary/50 cursor-pointer'}>{chatbotType.name}</Badge>))            }
        </div>
    )
    
}