import './index.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Main from "./pages/Main.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import AppLayout from "@/layout/AppLayout.tsx";
import ChatLayout from "@/layout/ChatLayout.tsx";
import {Button} from "rael-ui"
import {fetchTest} from "@/api/test.ts";
import {useEffect, useState} from "react";


function App() {
    return (
        <Routes>
            <Route element={<AppLayout/>}>
                <Route index path={"/"} element={<Main/>}/>
                <Route element={<ChatLayout/>}>
                    <Route path={'/chat/:chatId'} element={<ChatPage/>}/>
                </Route>
                <Route path={'/test'} element={<Test/>}/>
            </Route>
            <Route path={'*'} element={<Navigate to={'/'}/>}/>
        </Routes>
    )
}

const Test = () => {
    const [result, setResult] = useState()
    
    // const getRes = () => {
    //    
    // }
    
    return (
        <Button className={'m-10'} onClick={() =>fetchTest()}>Send</Button>
    )
}


export default App
