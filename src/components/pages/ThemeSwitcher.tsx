import {cn, Stack, Switch, SwitchLabel} from "rael-ui"
import {useUserPrefStore} from "@/store/userPrefStore.ts";
import {useEffect} from "react";

type ThemeSwitcherProps = {
    className?: string
}
const ThemeSwitcher = ({className} : ThemeSwitcherProps) => {
    const darkMode = useUserPrefStore(state => state.darkMode);
    const toggleDarkMode = useUserPrefStore(state => state.toggleDarkMode);


    
    const handleToggleDarkMode = () => {
        toggleDarkMode();
        // updateUserPrefMutation({
        //     theme : darkMode ? "dark" : "light"
        // })
    }

    useEffect(() => {
        document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);
    
    return (
        <Stack className={cn("", className)} direction={'horizontal'} >
            <Switch checked={darkMode} onChange={() => handleToggleDarkMode()}>
                <SwitchLabel>DarkMode</SwitchLabel>
            </Switch>
        </Stack>
    )
}

export default ThemeSwitcher