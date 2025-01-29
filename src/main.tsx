import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {BrowserRouter as Router} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import "./index.css"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'always',
        },
        mutations: {
            networkMode: 'always',
        }
    }
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <Router>
          <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false}/>
              <App/>
          </QueryClientProvider>    
      </Router>
  </React.StrictMode>,
);
