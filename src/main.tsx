import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import ChatProvider from "@/context/ChatProvider.tsx";
import MessageProvider from "@/context/MessageProvider.tsx";
import ThemeProvider from "@/context/ThemeProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <ChatProvider>
                <ThemeProvider>
                    <MessageProvider>
                        <App/>
                    </MessageProvider>
                </ThemeProvider>
            </ChatProvider>
        </Router>
    </StrictMode>,
)
