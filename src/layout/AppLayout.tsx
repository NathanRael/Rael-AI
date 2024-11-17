import {Outlet} from "react-router-dom";
import Sidebar from "@/components/pages/Sidebar.tsx";

const AppLayout = () => {
    return (
        <section>
            <Sidebar/>
           <Outlet/> 
        </section>
    )
}

export default AppLayout