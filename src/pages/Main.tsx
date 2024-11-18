import {Stack, cn} from "rael-ui"
import {INPUT_WIDTH} from "@/constants/style.ts";

import ThemeSwitcher from "@/components/pages/ThemeSwitcher.tsx";
import ModelSwitcher from "@/components/pages/ModelSwitcher.tsx";
import ChatInput from "@/components/pages/ChatInput.tsx";


const Main = () => {
    
    return (
        <section className={'h-full  pt-[256px] px-4 '}>
            <Stack>
                <ModelSwitcher/>
                <ThemeSwitcher className={'pb-10'}/>
            </Stack>
            <Stack direction={'vertical'} gap={40}>
                <Stack className={'w-full'} direction={'vertical'} gap={8}>
                    <h1 className={'text-[56px] text-center text-black  font-bold dark:text-white'}>Rael AI</h1>
                    <p className={'text-xl text-center text-gray-800 dark:text-gray-400 '}>Having some coding questions ? Well, let me know .</p>
                </Stack>
                <div className={cn(`${INPUT_WIDTH}`, 'max-md:w-[96%]')}>
                    <ChatInput/>
                </div>
            </Stack>
            
        </section>
    )
}


export default Main;