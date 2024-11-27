import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import MessageProvider from "@/context/MessageProvider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import UserPrefProvider from "@/context/UserPrefProvider.tsx";

const queryClient = new QueryClient({
    defaultOptions : {
        queries: {
            networkMode : 'always'
        },
        mutations : {
            networkMode : 'always'
        }
    }
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
         <Router>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools  initialIsOpen={false}/>
                    <UserPrefProvider>
                        <MessageProvider>
                            <App/>
                        </MessageProvider>
                    </UserPrefProvider>
            </QueryClientProvider>
        </Router>
    </StrictMode>,
)
