import {cn, Icon} from "rael-ui";
import {X} from "lucide-react";

const ImageInputPreview = ({className, image, onClose} : {className? : string, image : string, onClose : () => void}) => {
    
    return (
        <div className={cn('relative', className)}>
            <Icon onClick={onClose} size={'sm'} className={'p-1 absolute -top-2 -left-2 bg-input-fill-l-bg  dark:bg-input-fill-d-bg'} variant={'secondary'}><X className={'text-black dark:text-white'} size={16}/></Icon>
            <img src={image} alt={'image upload'}
                             className={'size-[128px] border-2 border-black/60 dark:border-white/20 object-cover rounded-xl'}/>
        </div>
    );
};

export default ImageInputPreview;