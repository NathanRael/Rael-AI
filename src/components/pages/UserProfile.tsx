import {useUserStore} from "@/store/userStore.ts";
import {Button, cn} from "rael-ui";
import {LogOut} from "lucide-react";
import {logout} from "@/api/authApi.ts";
import {useNavigate} from "react-router-dom";

const UserProfile = ({className} : {className?: string}) => {
    const user = useUserStore(state => state.user)
    const navigate = useNavigate();
    
    const handleLogout =  async () => {
        try {
            await logout();
            navigate('/login')
        }   catch(e) {
            console.log(e)
        }
    }
    return (
        <div className={cn('', className)}>
           <Button size={'sm'} variant={'primary'} onClick={handleLogout} radius={'xl'}><LogOut size={16}/> Logout</Button>
        </div>
    );
};

export default UserProfile;