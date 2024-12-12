import {Badge, cn} from "rael-ui";
import {Tool} from "@/api/toolsApi.ts";



type ToolListProps = {
    tools : Tool[];
    className?: string;
    onClick: (tool : Tool) => void;
}
const ToolList = ({tools, className, onClick} : ToolListProps) => {
    return (
        <div className={cn('flex items-center justify-start gap-4', className)}>
            {
                tools.map(tool => (
                    <div onClick={() => onClick(tool)}>
                        <Badge key={tool.keyword} size={'sm'} className={'dark:bg-primary/40 bg-primary/60 cursor-pointer'}>{tool.keyword}</Badge>
                    </div>
                ))
            }
        </div>
    );
};

export default ToolList;