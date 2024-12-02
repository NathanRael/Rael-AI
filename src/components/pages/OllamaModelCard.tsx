import {Badge, Button, Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Icon} from "rael-ui";
import {OllamaModel} from "@/api/ollamaModelsApi.ts";
import {ChevronDown, Download} from "lucide-react";


const OllamaModelCard = ({name, description, link, sizes, capability}: OllamaModel) => {
    return (
        <div className={'flex flex-col w-[480px] max-md:w-full gap-6 p-1'}>
            <div className={'flex flex-col gap-4'}>
                <div className={'space-y-2'}>
                    <p onClick={() => window.open(link, '_blank')}
                       className={'text-subtitle font-bold cursor-pointer w-fit  text-black dark:text-white underline'}>{name}</p>
                    <p className={'text-base   text-black dark:text-white/70'}>{description}</p>
                </div>
                <div className={'flex items-center justify-start gap-4 '}>
                    {capability && <Badge size={'sm'} className={'bg-secondary/80 dark:bg-secondary/50'}>{capability}</Badge>}
                    {sizes?.map((size, index) => (
                        <Badge key={size + index} size={'sm'} className={'bg-primary/80 dark:bg-primary/50'}>{size}</Badge>))}
                </div>
            </div>
            <Dropdown>
                <DropdownTrigger>
                    <div className={'flex'}>
                        <Button  className={'button-gradient '} radius={'lg'}>  Pull model <ChevronDown size={20}/></Button>
                    </div>
                </DropdownTrigger>
                <DropdownContent>
                    {sizes.map((size, index) => (<DropdownItem key={size+index}> <Download size={16}/> {size} </DropdownItem>))}
                </DropdownContent>
            </Dropdown>
        </div>
    );
};

export default OllamaModelCard;