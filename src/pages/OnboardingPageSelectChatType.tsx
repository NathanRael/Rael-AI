import {Badge, Checkbox, CheckboxLabel, cn} from "rael-ui";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import {useEffect, useMemo, useState} from "react";
import Stepper from "@/components/ui/Stepper.tsx";
import {ChatPageImage, MainPageImageLight} from "@/constants/images.ts";
import {ChatbotType, fetchChatbotTypes} from "@/api/chatbotTypesApi.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import ErrorUI from "@/components/ui/ErrorUI.tsx";
import {useChatbotTypeStore} from "@/store/chatbotTypeStore.ts";
import {updateUserPreferences} from "@/api/userPreferencesApi.ts";
import {useUserStore} from "@/store/userStore.ts";
import {useUserPrefStore} from "@/store/userPrefStore.ts";

type ChatbotTypeSelectList = {
    error: Error;
    loading: boolean;
    chatbotTypes: ChatbotType[];
    onSelect: (formData: Record<string, boolean>[]) => void;
}
const OnboardingPageSelectChatType = () => {
    const user = useUserStore(state => state.user)
    const navigate = useNavigate();
    const darkMode = useUserPrefStore(state => state.darkMode);
    const selectedChatbotType = useChatbotTypeStore(state => state.selectedChatbotType)
    const queryClient = useQueryClient()

    const {mutateAsync : updateUserPreferencesMutation} = useMutation({
        mutationFn : updateUserPreferences,
        onSuccess : () => {
            queryClient.invalidateQueries([queryKeys.userPreferences])
            navigate('/')
        }
    })
    
    const handleNext = async () => {
        await updateUserPreferencesMutation({
            user_id : user.id,
            main_chatbot_types : Object.entries(selectedChatbotType).map(([_, value]) => value) ,
            has_onboarded : true,
        })
    }
    
    return (
        <section className="onboarding-page flex gap-6 h-screen w-full">
            <div className={"basis-1/2 flex flex-col gap-10 justify-between pb-[128px]"}>
                <SelectChatbotType/>
                <Stepper disabled={{
                    nextButton : selectedChatbotType.length < 3
                }} end={true} onNext={handleNext} onPrevious={() => navigate('/onboarding/chooseModel')}
                         className={''}/>
            </div>
            <div
                className="basis-1/2   overflow-hidden p-2 rounded-2xl flex flex-col gap-2 justify-between relative">
                <img src={ChatPageImage}
                     className={' border-black/10 dark:border-white/10 border-4  skew-x-2 object-cover rounded-xl overflow-hidden w-full object-top'}
                     alt={'Main chatbot page'}/>
                <div
                    className={'relative border-black/10 dark:border-white/10 border-4 overflow-hidden -skew-x-2 rounded-xl '}>
                    {darkMode && <div className={'absolute w-full h-full bg-black/60'}/>}
                    <img src={MainPageImageLight} className={'  object-cover rounded-xl overflow-hidden  w-full'}
                         alt={'Main chatbot page'}/>
                </div>
                {/*<img src={ChatPageImage} className={' object-contain rounded-xl overflow-hidden'} alt={'Chat page'}/>*/}
            </div>
        </section>
    );
};

export default OnboardingPageSelectChatType;

const SelectChatbotType = () => {
    const updateSelectedChatbotType = useChatbotTypeStore(state => state.updateSelectedChatbotType)
    
    const {
        data: chatbotTypes,
        error: chatbotTypeError,
        isLoading: isFetchingChatbotTypes,
        // refetch: reFetchOllamaModels
    } = useQuery({
        queryFn: () => fetchChatbotTypes({}),
        queryKey: [queryKeys.chatbotTypeList]
    })

    
    const AvailableChatbotType = useMemo(() => {
        if (isFetchingChatbotTypes || chatbotTypeError || !chatbotTypes)
            return []
        return chatbotTypes!
    }, [chatbotTypes])
    

    return (
        <div className=" flex flex-col gap-10 overflow-hidden">
            <div className={'max-w -[540px]'}>
                <h1 className={'text-black dark:text-white text-big-title font-bold'}>Select 3 chatbot types</h1>
                <p className={'text-lead text-black/80 dark:text-white/80'}>Select three chatbot type which you will use
                    the most.It will be pinned in the main chat</p>
            </div>
            <div className={'flex flex-col gap-8 items-start rounded-xl '}>
                <div className={'space-y-4'}>
                    <h1 className={'text-lead text-black dark:text-white'}>Available Chatbot type</h1>
                    <ChatbotTypeSelectList
                        onSelect={formData =>
                            updateSelectedChatbotType(
                                formData.flatMap(items =>
                                    Object.entries(items)
                                        .filter(([_, value]) => value)
                                        .map(([key, _]) => key)
                                )
                            )
                        }
                        chatbotTypes={AvailableChatbotType} error={chatbotTypeError as Error}
                        loading={isFetchingChatbotTypes}/>
                </div>
            </div>
        </div>
    )
}


const ChatbotTypeSelectList = ({chatbotTypes, loading, error, onSelect}: ChatbotTypeSelectList) => {
    const [formData, setFormData] = useState<Record<string, boolean>[]>([])
    const selectedChatbotType = useChatbotTypeStore(state => state.selectedChatbotType)

    const updateFormData = (name: string, value: boolean) => {
        setFormData(prevState => {
            const updatedState = prevState.map(item =>
                item.hasOwnProperty(name) ? {[name]: value} : item
            );

            if (!prevState.some(item => item.hasOwnProperty(name))) {
                updatedState.push({[name]: value});
            }

            return updatedState;
        })
    }
    
    const hasSelected = (count : number, chatbotType : ChatbotType) => {
        return selectedChatbotType.length === count && selectedChatbotType.every(value => value !== chatbotType.id)
    }

    useEffect(() => {
        onSelect(formData)
    }, [formData])

    useEffect(() => {
        if (loading || error || !chatbotTypes)
            return;

        setFormData(chatbotTypes?.map(chatbotType => ({[chatbotType.name]: false})))
    }, [loading, chatbotTypes, error])


    if (loading)
        return <LoaderUI/>

    if (error)
        return <ErrorUI error={error} onRetry={() => {
        }}/>


    return (
        <div className={'flex flex-row flex-wrap gap-4'}>
            {
                chatbotTypes.map(chatbotType => (
                    <Badge  key={chatbotType.id} className={cn('bg-primary/80 text-white dark:bg-primary/50 cursor-pointer', hasSelected(3,chatbotType) && 'cursor-none bg-black/10  dark:bg-white/10')}>
                        <Checkbox disabled={hasSelected(3, chatbotType)} size={'sm'} radius={'lg'} onChange={(e) => updateFormData(chatbotType.id, e.target.checked)}>
                            <CheckboxLabel className={cn('text-white', hasSelected(3,chatbotType) && 'text-black dark:text-white')}>{chatbotType.name}</CheckboxLabel>
                        </Checkbox>
                    </Badge>
                ))}
        </div>
    )

}