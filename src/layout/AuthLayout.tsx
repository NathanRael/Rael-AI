import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useLayoutEffect, useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import {User} from "@/api/usersApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useUserStore} from "@/store/userStore.ts";
import {useRequestInterceptor} from "@/hooks/useRequestInterceptor.ts";
import {useUserPrefStore} from "@/store/userPrefStore.ts";
import {hasToOnboard} from "@/utils/helpers.ts";
import {useFetchUserPref} from "@/hooks/useFetchUserPref.ts";
import LoaderUI from "@/components/ui/LoaderUI.tsx";
import {createPortal} from "react-dom";
import {logout} from "@/api/authApi.ts";
import {api} from "@/utils/api.ts";

const AuthLayout = () => {
    useRequestInterceptor();
    
    const navigate = useNavigate();
    const updateUser = useUserStore(state => state.updateUser)
    const {setHasOnboarded} = useUserPrefStore();
    
    const { data: user, error: userError, isError, isSuccess, isLoading: isFetchingUser } = useQuery({
        // queryFn : fetchActiveUser,
        queryFn: async () => {
            try {
                const response = await api.get<User>(`api/me`);
                return response.data;
            } catch (error) {
                await (async () => {
                    await logout();
                    navigate("/login", { replace: true });
                })();
            }
        },
        queryKey: [queryKeys.activeUser],
    });
    
    const {data: userPrefs, isLoading: isFetchingUserPrefs, isSuccess: isSuccessUserPrefs} = useFetchUserPref(user)
    const needsOnboarding = useMemo(() => hasToOnboard(userPrefs), [userPrefs]);

/*    useLayoutEffect(() => {
        if (isError) {
            console.log("Error");
            
            (async () => {
                await logout();
                navigate("/login", { replace: true });
            })();
        }
    }, [isError]);*/
    
    useLayoutEffect(() => {
        if (isSuccess && user) {
            updateUser(user);
        }
    }, [isError, isSuccess, user, navigate, userError, updateUser]);

    useEffect(() => {
        if (isFetchingUserPrefs || !userPrefs) return;

        setHasOnboarded(!needsOnboarding);
        if (needsOnboarding) navigate("/onboarding/chooseModel");
        
    }, [
        isFetchingUserPrefs,
        isSuccessUserPrefs,
        userPrefs,
        needsOnboarding,
        setHasOnboarded,
    ]);


    if (isFetchingUser || isFetchingUserPrefs ) {
        return createPortal(<LoaderUI className={'absolute top-1/2 left-1/2 '}/>, document.body);
    }
    
    

    return (
        <section>
            <Outlet/>
        </section>
    )
}

export default AuthLayout