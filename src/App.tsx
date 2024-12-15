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
import ChatFileInput from "@/components/ui/ChatFileInput.tsx";


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
    return (
        <div className={'p-10'}>
            <ChatFileInput/>
        </div>
    )
}


export default App

