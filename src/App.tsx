import './index.css'
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import Main from "./pages/Main.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import AppLayout from "@/layout/AppLayout.tsx";
import ChatLayout from "@/layout/ChatLayout.tsx";
import {Button} from "rael-ui"
import ExploreChatPage from "@/pages/ExploreChatPage.tsx";
import Sidebar from "@/components/pages/Sidebar.tsx";
import {useState} from "react";
import {fetchStreamedResponse} from "@/api/test.ts";


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
    const [data, setData] = useState("");
    const prompt = "Who are you ?"
    const handleClick = async () => {
            await fetchStreamedResponse(prompt, (v) => setData(prevState => prevState + v));
    }

    return (
        <div className={'p-10 space-y-6'}>
            <div className={'text-white w-[480px] '}>{data}</div>
            <Button onClick={() => handleClick()}>Send</Button>
        </div>
    )
}


export default App

