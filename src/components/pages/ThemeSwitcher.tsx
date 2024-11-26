import {Switch, cn, Stack, SwitchLabel} from "rael-ui"
import {useUserPrefContext} from "@/context/UserPrefProvider.tsx";

type ThemeSwitcherProps = {
    className?: string
}
const ThemeSwitcher = ({className} : ThemeSwitcherProps) => {
    const {toggleDarkMode,darkMode} = useUserPrefContext();
    
    return (
        <Stack className={cn("", className)} direction={'horizontal'} >
            <Switch checked={darkMode} onChange={() => toggleDarkMode()}>
                <SwitchLabel>DarkMode</SwitchLabel>
            </Switch>
        </Stack>
    )
}

export default ThemeSwitcher