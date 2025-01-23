import {CopyrightIcon, Github, Linkedin} from "lucide-react";
import {cn, Icon} from "rael-ui";
import {MY_EMAIL, MY_GITHUB_PROFILE, MY_LINKEDIN_PROFILE} from "@/constants";

const Copyright = ({className}: { className?: string }) => {
    return (
        <div
            className={cn('text-black-100 dark:text-white-100 flex flex-row items-center justify-center gap-4', className)}>
            <div className="flex flex-row items-center justify-center gap-2">
                <CopyrightIcon size={20}/>
                <a target={'_blank'} href={`mailto:${MY_EMAIL}`}
                   className={'text-[12px] hover:underline cursor-pointer'}> Natanaël RALAIVOAVY</a>
            </div>
            <a target={'_blank'} href={MY_GITHUB_PROFILE}>
                <Icon variant={'ghost'} className={'group rounded-full'}>
                    <Github size={20}/>
                </Icon>
            </a>
            <a target={'_blank'} href={MY_LINKEDIN_PROFILE}>
                <Icon variant={'ghost'} className={'rounded-full '}>
                    <Linkedin className={'text-secondary-100 '} size={20}/>
                </Icon>
            </a>

        </div>
    )
}

export default Copyright