import {CopyrightIcon} from "lucide-react";
import { cn } from "rael-ui";

const Copyright = ({className} : {className?: string}) => {
    return (
        <div className={cn('text-meta-fill-l-text dark:text-meta-fill-d-text flex flex-row items-center justify-center gap-2', className)}>
            <CopyrightIcon size={20} />
           <a  href={'mailto:ralaivoavy.natanael@gmail.com'} className={'text-[12px] hover:underline cursor-pointer'}> Natanaël RALAIVOAVY</a>
        </div>
    )
}

export default Copyright