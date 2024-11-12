import {Switch, cn, Stack, SwitchLabel} from "rael-ui"
import {useThemeContext} from "@/context/ThemeProvider.tsx";

type ThemeSwitcherProps = {
    className?: string
}
const ThemeSwitcher = ({className} : ThemeSwitcherProps) => {
    const {toggleDarkMode,darkMode} = useThemeContext();
    
    return (
        <Stack className={cn("", className)} direction={'horizontal'} >
            <Switch checked={darkMode} onChange={() => toggleDarkMode()}>
                <SwitchLabel>DarkMode</SwitchLabel>
            </Switch>
        </Stack>
    )
}

export default ThemeSwitcher