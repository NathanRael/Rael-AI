import {Outlet, useNavigate} from "react-router-dom";
import {useUserStore} from "@/store/userStore.ts";
import {useEffect, useMemo} from "react";
import {useFetchUserPref} from "@/hooks/useFetchUserPref.ts";
import {hasToOnboard} from "@/utils/helpers.ts";
import {createPortal} from "react-dom";
import LoaderUI from "@/components/ui/LoaderUI.tsx";

const OnboardingLayout = () => {
    const user = useUserStore(state => state.user);
    const navigate = useNavigate();

    const {data: userPreference, isLoading, isSuccess} = useFetchUserPref(user);
    const needsOnboarding = useMemo(() => hasToOnboard(userPreference), [userPreference]);


    useEffect(() => {
        if (isLoading || !userPreference) return

        if (!needsOnboarding)
            navigate("/");

    }, [isLoading, userPreference, isSuccess, needsOnboarding]);
    
    
    if (isLoading) {
        return createPortal(<LoaderUI className={'absolute top-1/2 left-1/2 '}/>, document.body);
    }
    
    
    return (
        <Outlet/>
    );
};

export default OnboardingLayout;