import {Info} from "lucide-react";
import { Stack, Button, cn } from "rael-ui";

type ErrorUIProps = {
    error : Error;
    onRetry: () => void;
    className?: string;
}
const ErrorUI = ({error, onRetry, className} : ErrorUIProps) => {
    return (
        <Stack  gap={16} className={cn('w-full', className)}>
            <Stack className={'text-center text-danger'} direction={'horizontal'} gap={8}>
                <Info/>
                <p className={'text-danger text-sm'}>Error : {error?.message}</p>
            </Stack>
            <Button variant={'secondary'} size={'sm'} radius={'2xl'} onClick={() => onRetry()} block>Retry</Button>
        </Stack>
    )
}

export default ErrorUI;