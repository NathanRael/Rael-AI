import {useCallback, useState} from "react";
import useFile from "@/hooks/useFile.ts";

export const useFileHandler = () => {
    const [file, setFile] = useState<File | null>(null);
    const {uploadedImage, setUploadedImage, handleFileUpload} = useFile(file);
    
    const resetImageContent = useCallback(() => {
        setUploadedImage('');
        setFile(null);
    }, [setUploadedImage, setFile]);
    
    return {
        handleFileUpload,
        uploadedImage,
        setUploadedImage,
        file,
        setFile,
        resetImageContent,
    }
}