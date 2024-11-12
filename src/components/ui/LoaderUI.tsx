import {Stack, cn} from "rael-ui"
import {Loader} from "lucide-react";

type LoaderProps = {
    customLoader?: React.ReactNode;
    title?: string;
    className?: string;
}
const LoaderUI = ({customLoader, title, className} : LoaderProps) => {
    return (
        <Stack className={cn('', className)} gap={8}>
            {
                !customLoader && <Loader size={32} className={'animate-spin'}/>
            }
            {customLoader}
            {title && <p className={'text-black'}>{title}</p>}
        </Stack>
    )
}

export default LoaderUI