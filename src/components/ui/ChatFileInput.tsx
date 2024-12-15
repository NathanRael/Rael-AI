import {ChangeEvent, useEffect, useRef, useState} from "react";
import {cn, Icon} from "rael-ui";
import {Image} from "lucide-react";


type ChatFileInputProps = {
    className?: string;
    onChange: (file: File) => void;
    deleteFileContent: boolean;
    disabled : boolean;
}
const ChatFileInput = ({className, onChange, deleteFileContent, disabled}: ChatFileInputProps) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            onChange(e.target.files[0]);
        
        if (e.target.value)
            setFile(e.target.value);
    }

    const handleChooseFile = () => {
        if (!fileRef.current) return;
        fileRef.current.click();
    }

    useEffect(() => {
        if (deleteFileContent) setFile('');
    }, [deleteFileContent]);

    return (
        <div className={cn('relative', className)}>
            <Icon disabled={disabled} onClick={() => handleChooseFile()} variant={'ghost'} size={'sm'}>
                <Image size={20}/>
            </Icon>
            <input ref={fileRef} value={file} type={'file'} className={'text-white hidden'}
                   onChange={handleFileChange}/>
        </div>
    );
};

export default ChatFileInput;