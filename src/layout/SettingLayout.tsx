import {Outlet, useNavigate} from "react-router-dom";
import {Icon} from "rael-ui";
import {ChevronLeft} from "lucide-react";
import SettingSidebar from "@/components/pages/SettingSidebar";

const SettingLayout = () => {
    const navigate = useNavigate();
    return (
        <section className={"flex flex-row items-start justify-start pt-20 px-4"}>
            <div className={"flex flex-col items-start justify-start gap-6 basis-[30%]"}>
                <div className={'flex items-center justify-start flex-row gap-2'}>
                    <Icon onClick={() => navigate(-1)} size={'sm'} variant={'ghost'}>
                        <ChevronLeft size={32}/>
                    </Icon>
                    <h1 className={'text-title text-black-100 dark:text-white-100 font-bold'}>Settings</h1>
                </div>
                <SettingSidebar />
            </div>
            <div className={"basis-full"}>
                <Outlet/>
            </div>
        </section>
    )
}
export default SettingLayout
