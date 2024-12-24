import './index.css'
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import AuthLayout from "@/layout/AuthLayout.tsx";
import ChatLayout from "@/layout/ChatLayout.tsx";
import ExploreChatPage from "@/pages/ExploreChatPage.tsx";
import Sidebar from "@/components/pages/Sidebar.tsx";
import ExploreModelPage from "@/pages/ExploreModelPage.tsx";
import OnboardingPageChooseModel from "@/pages/OnboardingPageChooseModel.tsx";
import {createPortal} from "react-dom";
import ThemeSwitcher from "@/components/pages/ThemeSwitcher.tsx";
import OnboardingPageSelectChatType from "@/pages/OnboardingPageSelectChatType.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import OnboardingLayout from "@/layout/OnboardingLayout.tsx";
import RegisterPage from "@/pages/RegisterPage.tsx";
import UserProfile from "@/components/pages/UserProfile.tsx";
import ModelSwitcher from "@/components/pages/ModelSwitcher.tsx";
import SettingPage from "@/pages/SettingPage.tsx";


function App() {
    return (
        <Routes>
            <Route element={<DevLayout enable={true}/>}>
                <Route element={<LoginPage/>} path={'/login'}/>
                <Route element={<RegisterPage/>} path={'/register'}/>
                <Route element={<AuthLayout/>}>
                    <Route element={
                        <>
                            <Outlet/>
                            <ModelSwitcher className={'fixed left-1/2 top-6 -translate-x-1/2 z-30'}/>
                            <UserProfile className={'fixed right-6 top-6 z-30'}/>
                            <Sidebar/>
                            
                        </>
                    }>
                        <Route index path={"/"} element={<MainPage/>}/>
                        <Route element={<ChatLayout/>}>
                            <Route path={'/chat/:chatId'} element={<ChatPage/>}/>
                        </Route>
                        <Route path="/settings" element={<SettingPage/>}/>
                        
                    </Route>
                    <Route path={'/test'} element={<Test/>}/>
                    <Route path={'chat/explore'} element={<ExploreChatPage/>}/>
                    <Route path={'models/explore'} element={<ExploreModelPage/>}/>
                    

                    <Route element={<OnboardingLayout/>}>
                        <Route path={'/onboarding/chooseModel'} element={<OnboardingPageChooseModel/>}/>
                        <Route path={'/onboarding/selectChatbotType'} element={<OnboardingPageSelectChatType/>}/>
                    </Route>
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
        </div>
    )
}


export default App

