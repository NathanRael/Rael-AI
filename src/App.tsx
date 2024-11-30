import './index.css'
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import Main from "./pages/Main.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import AppLayout from "@/layout/AppLayout.tsx";
import ChatLayout from "@/layout/ChatLayout.tsx";
import {Button} from "rael-ui"
import {fetchTest} from "@/api/test.ts";
import ExploreChatPage from "@/pages/ExploreChatPage.tsx";
import Sidebar from "@/components/pages/Sidebar.tsx";


function App() {
    return (
        <Routes>
            <Route element={<AppLayout/>}>
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
            </Route>
            <Route path={'*'} element={<Navigate to={'/'}/>}/>
        </Routes>
    )
}

const Test = () => {


    return (
        <Button className={'m-10'} onClick={() => fetchTest()}>Send</Button>
    )
}


export default App

