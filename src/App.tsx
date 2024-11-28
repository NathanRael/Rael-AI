import './index.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Main from "./pages/Main.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import AppLayout from "@/layout/AppLayout.tsx";
import ChatLayout from "@/layout/ChatLayout.tsx";



function App() {
    return (
        <Routes>
            <Route element={<AppLayout/>}>
                <Route index path={"/"} element={<Main/>}/>
                <Route element={<ChatLayout/>}>
                    <Route path={'/chat/:chatId'} element={<ChatPage/>}/>
                </Route>
            </Route>
            <Route path={'*'} element={<Navigate to={'/'}/>}/>
        </Routes>
    )
}


export default App
