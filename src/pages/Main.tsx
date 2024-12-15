import {Stack, cn} from "rael-ui"
import {INPUT_WIDTH} from "@/constants/style.ts";

import ChatInput from "@/components/pages/ChatInput.tsx";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import {useEffect} from "react";
import {ChevronRight, Slack} from "lucide-react";
import {Button} from "rael-ui"
import ChatbotTypeToggleList from "@/components/pages/ChatbotTypeToggleList.tsx";
import {fetchMainChatbotTypes} from "@/api/chatbotTypesApi.ts";
import {fetchUserPreferences} from "@/api/userPreferencesApi.ts";
import Copyright from "@/components/pages/Copyright.tsx";
import useLocalSearchParams from "@/hooks/useLocalSearchParams.ts";
import {useLocation, useNavigate} from "react-router-dom";
import ModelSwitcher from "@/components/pages/ModelSwitcher.tsx";
import {useUserStore} from "@/store/userStore.ts";
import {useModelStore} from "@/store/useModelStore.ts";
const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useUserStore(state => state.user)
    const updateSelectedModel = useModelStore(state => state.updateSelectedModel)
    
    
    const {
        data: chatbotTypes,
        isLoading: isFetchingChatbotTypes,
        error: chatbotTypeError,
        refetch: reFetchChatbotTypes
    } = useQuery({
        enabled : !!user.id,
        queryFn: () => fetchMainChatbotTypes(user.id),
        queryKey: [queryKeys.chatbotTypeList]
    })

    const {data: userPreferences, isLoading: isFetchingUserPreferences, error: userPreferencesError, isSuccess : isUserPrefFetched} = useQuery({
        enabled : !!user.id,
        queryFn: () => fetchUserPreferences(user.id),
        queryKey: [queryKeys.userPreferences],
    })

    const {updateSearchParam} = useLocalSearchParams();

    useEffect(() => {
        if (!userPreferences || !isUserPrefFetched) return 
        updateSelectedModel(userPreferences.model)
    }, [isUserPrefFetched])
        
    useEffect(() => {
        if (!isFetchingUserPreferences && !userPreferencesError && userPreferences)
            updateSearchParam("chatType", userPreferences.chatbot_type_id)
    }, [userPreferences, isFetchingUserPreferences, location.pathname])
    

    return (
        <section className={'h-full space-y-10 pt-4 max-md:pt-16 pb-10 px-4 '}>

            <Stack direction={'vertical'} className={'items-start w-fit mx-auto'} gap={32}>
                <div className={'flex flex-col gap-8 items-start p-2 rounded-xl h-fit '}>
                    <div className={'space-y-4'}>
                        <h1 className={'text-lead text-black dark:text-white'}>Choose a model</h1>
                        <ModelSwitcher/>
                    </div>
                    <Button onClick={() => navigate('/model/explore')} size={'sm'} variant={'ghost'} radius={'xl'}>
                        <Slack size={16}/>
                        Explore
                        <ChevronRight/>
                    </Button>
                </div>
                <div className={'flex flex-col gap-8 items-start p-2 rounded-xl '}>
                    <div className={'space-y-4'}>
                        <h1 className={'text-lead text-black dark:text-white'}>Select a chat type</h1>
                        <ChatbotTypeToggleList chatbotTypes={chatbotTypes!} loading={isFetchingChatbotTypes}
                                               error={chatbotTypeError as Error} onRetry={reFetchChatbotTypes}/>
                    </div>
                    <Button onClick={() => navigate('/chat/explore')} size={'sm'} variant={'ghost'} radius={'xl'}>
                        <Slack size={16}/>
                        Explore
                        <ChevronRight/>
                    </Button>
                </div>

            </Stack>
            <Stack direction={'vertical'} gap={64}>
                <Stack className={'w-full'} direction={'vertical'} gap={8}>
                    <h1 className={'text-[56px] text-center text-black  font-bold dark:text-white'}>Rael AI</h1>
                    <p className={'text-xl text-center text-gray-800 dark:text-gray-400 '}>
                        Hello
                        <span className={'font-bold text-black dark:text-white px-2'}>{user.username},</span>
                        Having some coding questions today ?
                    </p>
                </Stack>
                <div className={cn(`${INPUT_WIDTH}`, 'max-md:w-[96%]')}>
                    <ChatInput/>
                </div>
            </Stack>
            <Copyright className={''}/>
        </section>
    )
}


export default Main;

