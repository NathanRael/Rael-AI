import {cn} from "rael-ui";
import {useLocation, useNavigate} from "react-router-dom";
import {getSettingName} from "@/utils/helpers.ts";

const SettingSidebar = () => {
    const navigate = useNavigate();
    const pathname = useLocation().pathname;
    const settingName = getSettingName(pathname);
    
    return (
        <div className={"flex flex-col items-start justify-start gap-2"}>
            <SettingSidebarItem selected={settingName === 'profile'} name={'Profile'} onClick={() => navigate("/settings/profile")}/>
            {/*<SettingSidebarItem selected={settingName === 'connection'} name={'Connection'} onClick={() => navigate("/settings/connection")}/>*/}
        </div>
    )
}
export default SettingSidebar


const SettingSidebarItem = ({selected, name, onClick} : {selected : boolean, name : string, onClick : () => void}) => {
    return (
        <div
            onClick={onClick}
            className={cn('flex  cursor-pointer items-center justify-start gap-2 w-full bg-transparent rounded-xl py-2 px-6 hover:bg-black/20 dark:hover:bg-neutral-dark-40', selected && 'bg-black/20 dark:bg-neutral-dark-40')}>
            <h1 className={'text-black-100 dark:text-white-100'}>{name}</h1>
        </div>
    )
}