﻿import {Button, cn, Stack} from "rael-ui"
import {INPUT_WIDTH} from "@/constants/style.ts";

import ChatInput from "@/components/pages/ChatInput.tsx";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import {useEffect} from "react";
import {ChevronRight, Slack} from "lucide-react";
import AgentToggleList from "@/components/pages/AgentToggleList.tsx";
import {fetchMainChatbotTypes} from "@/api/chatbotTypesApi.ts";
import Copyright from "@/components/pages/Copyright.tsx";
import useLocalSearchParams from "@/hooks/useLocalSearchParams.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useUserStore} from "@/store/userStore.ts";
import {hasToOnboard} from "@/utils/helpers.ts";
import {useFetchUserPref} from "@/hooks/useFetchUserPref.ts";

const MainPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useUserStore(state => state.user)
    
    const {data: userPreferences, isLoading: isFetchingUserPreferences, error: userPreferencesError} = useFetchUserPref(user);
    
    const {
        data: chatbotTypes,
        isLoading: isFetchingChatbotTypes,
        error: chatbotTypeError,
        refetch: reFetchChatbotTypes
    } = useQuery({
        enabled : !!user.id && !hasToOnboard(userPreferences!),
        queryFn: () => fetchMainChatbotTypes(user.id),
        queryKey: [queryKeys.chatbotTypeList]
    })


    const {updateSearchParam} = useLocalSearchParams();
    
        
    useEffect(() => {
        if (!isFetchingUserPreferences && !userPreferencesError && userPreferences) {
            updateSearchParam("chatType", userPreferences?.chatbot_type_id)
        }
    }, [userPreferences, isFetchingUserPreferences, location.pathname])
    

    return (
        <>
            <section className={'h-full space-y-10 pt-[128px] max-md:pt-16 pb-10 px-4 '}>
                <Stack direction={'vertical'} align={'center'} gap={32}>
                    <div className={'flex flex-col gap-8 items-start p-2 rounded-xl '}>
                        {chatbotTypes?.length === 0 && <p className={'text-black-100 dark:text-white-100'}>No AI agent found</p>}
                        {
                            chatbotTypes && chatbotTypes.length > 0 && (
                                <>
                                    <div className={'space-y-4'}>
                                        <h1 className={'text-lead text-black dark:text-white'}>Select an AI Agent</h1>
                                        <AgentToggleList chatbotTypes={chatbotTypes!} loading={isFetchingChatbotTypes}
                                                         error={chatbotTypeError as Error} onRetry={reFetchChatbotTypes}/>
                                    </div>
                                    <Button onClick={() => navigate('/chat/explore')} size={'sm'} variant={'ghost'}
                                            radius={'xl'}>
                                        <Slack size={16}/>
                                        Explore
                                        <ChevronRight/>
                                    </Button>
                                </>
                            )
                        }
                    </div>

                </Stack>
                <Stack direction={'vertical'} gap={64}>
                    <Stack className={'w-full'} direction={'vertical'} gap={8}>
                        <h1 className={'text-[56px] text-center text-black  font-bold dark:text-white'}>Rael AI</h1>
                        <p className={'text-xl text-center text-gray-800 dark:text-gray-400 '}>
                            Hello
                            <span className={'font-bold text-black dark:text-white px-2'}>{user.username},</span>
                            How can I help you ?
                        </p>
                    </Stack>
                    <div className={cn(`${INPUT_WIDTH}`, 'max-md:w-[96%]')}>
                        <ChatInput/>
                    </div>
                </Stack>
                <Copyright className={''}/>
            </section>
        </>

    )
}


export default MainPage;

