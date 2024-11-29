import {Stack, cn} from "rael-ui"
import {INPUT_WIDTH} from "@/constants/style.ts";

import ChatInput from "@/components/pages/ChatInput.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchUsers, User} from "@/api/usersApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useEffect, useMemo} from "react";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import {Info} from "lucide-react";
import {Button} from "rael-ui"
import ChatbotTypeList from "@/components/pages/ChatbotTypeList.tsx";
import {fetchChatbotTypes} from "@/api/chatbotTypesApi.ts";
import {fetchUserPreferences} from "@/api/userPreferencesApi.ts";
import {USER_ID} from "@/constants";
import {useSearchParams} from "react-router-dom";
import Copyright from "@/components/pages/Copyright.tsx";

const Main = () => {
    const {data : users, isLoading : isFetchingUsers, error : usersError, refetch : reFetchUsers} = useQuery({
        queryFn : () => fetchUsers({}),
        queryKey : [queryKeys.users],
    })
    
    const {data : chatbotTypes, isLoading : isFetchingChatbotTypes, error : chatbotTypeError, refetch : reFetchChatbotTypes} = useQuery({
        queryFn : fetchChatbotTypes,
        queryKey : [queryKeys.chatbotTypeList]
    })
    
    const {data : userPreferences, isLoading : isFetchingUserPreferences, error : userPreferencesError} = useQuery({
        queryFn : () => fetchUserPreferences(USER_ID),
        queryKey : [queryKeys.userPreferences],
    })
    
    const [_, updateSearchParams] = useSearchParams();
    
    const user = useMemo(() => !isFetchingUsers && !usersError ? users![0] : {} as User, [users])
    
    useEffect(() => {
        if (!isFetchingUserPreferences && !userPreferencesError && userPreferences)
            updateSearchParams({"chatType": userPreferences.chatbot_type_id})
    }, [userPreferences, isFetchingUserPreferences])
    
    if (isFetchingUsers) 
        return <LoaderUI title={'Getting things ready'} className={'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'} />
    
    
    if (usersError) 
        return (
            <Stack  gap={16} className={'w-full'}>
                <Stack className={'text-center text-danger'} direction={'horizontal'} gap={8}>
                    <Info/>
                    <p className={'text-danger text-sm'}>Error : {usersError?.message}</p>
                </Stack>
                <Button variant={'secondary'} size={'sm'} radius={'2xl'} onClick={() => reFetchUsers()} block>Retry</Button>
            </Stack>
        )
    
    return (
        <section className={'h-full space-y-10 pt-[128px] px-4 '}>
            <Stack>
                <ChatbotTypeList chatbotTypes={chatbotTypes!} loading={isFetchingChatbotTypes} error={chatbotTypeError as Error} onRetry={reFetchChatbotTypes}/>
            </Stack>
            <Stack direction={'vertical'} gap={40}>
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
            <Copyright className={'absolute bottom-[32px] left-1/2 -translate-x-1/2'}/>
        </section>
    )
}


export default Main;

