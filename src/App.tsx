import './index.css'
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import Main from "./pages/Main.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import AuthLayout from "@/layout/AuthLayout.tsx";
import ChatLayout from "@/layout/ChatLayout.tsx";
import {Button} from "rael-ui"
import ExploreChatPage from "@/pages/ExploreChatPage.tsx";
import Sidebar from "@/components/pages/Sidebar.tsx";
import {useRef, useState} from "react";
import ExploreModelPage from "@/pages/ExploreModelPage.tsx";
import OnboardingPageChooseModel from "@/pages/OnboardingPageChooseModel.tsx";
import {createPortal} from "react-dom";
import ThemeSwitcher from "@/components/pages/ThemeSwitcher.tsx";
import OnboardingPageSelectChatType from "@/pages/OnboardingPageSelectChatType.tsx";
import {downloadOllamaModels} from "@/api/ollamaModelsApi.ts";
import Login from "@/pages/Login.tsx";
import AuthProvider from "@/context/AuthProvider.tsx";


function App() {
    return (
        <Routes>
            <Route element={<DevLayout enable={true}/>}>
                <Route element={<Login/>} path={'/login'}/>
                <Route element={<AuthLayout/>}>
                    <Route element={
                        <>
                            <Sidebar/>
                            <Outlet/>
                        </>
                    }>
                        <Route index path={"/"} element={<Main/>}/>
                        <Route element={<ChatLayout/>}>
                            <Route path={'/chat/:chatId'} element={<ChatPage/>}/>
                        </Route>
                    </Route>
                    <Route path={'/test'} element={<Test/>}/>
                    <Route path={'chat/explore'} element={<ExploreChatPage/>}/>
                    <Route path={'model/explore'} element={<ExploreModelPage/>}/>

                    <Route path={'/onboarding/chooseModel'} element={<OnboardingPageChooseModel/>}/>
                    <Route path={'/onboarding/selectChatbotType'} element={<OnboardingPageSelectChatType/>}/>
                </Route>
                
                <Route path={'*'} element={<Navigate to={'/'}/>}/></Route>
        </Routes>
    )
}


// For development only
const DevLayout = ({enable}: { enable: boolean }) => {
    return (
        <>
            {
                enable && createPortal(<ThemeSwitcher className={'fixed bottom-10 left-1/2'}/>, document.body)
            }
            <Outlet/>
        </>

    )
}

const Test = () => {
    const [data, setData] = useState("");
    const downloadAbortController = useRef<AbortController | null>(null);

    const downloadModel = async () => {
        try {
            downloadAbortController.current = new AbortController();

            await downloadOllamaModels({
                model_name: "nomic-embed-text",
                abortController: downloadAbortController,
                onchange: chunk => console.log(chunk)
            });
        } catch (e) {
            downloadAbortController.current?.abort('Error while downloading model');
        } finally {
            downloadAbortController.current = null;
        }
    }

    const handleAbort = () => {
        if (downloadAbortController.current) {
            downloadAbortController.current.abort();
            console.log('Download aborted by client');
        } else {
            console.log('No active download to abort');
        }
    };

    const handleClick = async () => {
        await downloadModel()
    }

    return (
        <div className={'p-10 space-y-6'}>
            <div className={'text-white w-[480px] '}>{data}</div>
            <Button variant={'ghost'} onClick={() => handleAbort()}>Abort</Button>
            <Button onClick={() => handleClick()}>Send</Button>
        </div>
    )
}


export default App

