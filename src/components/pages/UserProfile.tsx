import {cn} from "rael-ui";
import {logout} from "@/api/authApi.ts";
import {useNavigate} from "react-router-dom";
import {formatName} from "@/utils/helpers.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchActiveUser} from "@/api/usersApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {LogOut, Settings, Slack} from "lucide-react";
import {useRef, useState} from "react";
import useOutsideClicked from "@/hooks/useOutsideClicked.ts";

const UserProfile = ({className}: { className?: string }) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    
    const {data: user, isLoading} = useQuery({
        queryFn: () => fetchActiveUser(),
        queryKey: [queryKeys.users]
    })
    const navigate = useNavigate();
    
    useOutsideClicked({
        ref : popupRef,
        action : () => setShowPopup(false),
    })

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login')
        } catch (e) {
            console.log(e)
        }
    }

    if (isLoading || !user)
        return (
            <div
                className={cn('animate-pulse  bg-black/20 dark:bg-white/20 rounded-full p-2 size-[40px]', className)}>
            </div>
        )

    return (
        <div className={cn('relative', className)}>
            <div
                onClick={() => setShowPopup(prev => !prev)}
                className={'cursor-pointer hover:ring-2 dark:hover:ring-white/10 hover:ring-black/10 text-black text-base font-bold dark:text-white flex-centered item-center justify-center bg-black/20 dark:bg-white/20 rounded-full p-2 size-[40px]'}>
                <span>{formatName(user?.username)}</span>
            </div>
            {
                showPopup && (
                    <div
                        ref={popupRef}
                        className={'absolute top-[48px] right-0 gap-1 flex-centered flex-col items-start justify-start  min-w-[160px] shadow-md border border-neutral-light-60 dark:border-neutral-dark-60  bg-neutral-light-100 dark:bg-neutral-dark-80 rounded-xl p-2'}>
                        <div
                            className={'flex  w-full items-center justify-start gap-2 text-base text-black dark:text-white cursor-pointer hover:bg-neutral-light-80 dark:hover:bg-neutral-dark-60 p-2 rounded-xl'}>
                            <Settings size={20}/>
                            <span>Settings</span>
                        </div>
                        <div
                            onClick={() => navigate('/models/explore')}
                            className={'flex  w-full text-nowrap items-center justify-start gap-2 text-base text-black dark:text-white cursor-pointer hover:bg-neutral-light-80  dark:hover:bg-neutral-dark-60 p-2 rounded-xl'}>
                            <Slack size={20}/>
                            
                            <span>Explore models</span>
                        </div>
                        <div className={'line'}/>
                        <div
                            onClick={handleLogout}
                            className={'flex  w-full items-center justify-start gap-2 text-base text-black dark:text-white cursor-pointer hover:bg-neutral-light-80  dark:hover:bg-neutral-dark-60 p-2 rounded-xl'}>
                            <LogOut size={20}/>
                            <span>Logout</span>
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default UserProfile;