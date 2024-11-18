import './index.css'
import {Route, Routes} from "react-router-dom";
import Main from "./pages/Main.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import AppLayout from "@/layout/AppLayout.tsx";

function App() {

    return (
        <Routes>
            <Route element={<AppLayout/>}>
                <Route index path={"/"} element={<Main/>}/>
                <Route path={'/chat/:chatId'} element={<ChatPage/>}/>
            </Route>
        </Routes>
    )
}

export default App
