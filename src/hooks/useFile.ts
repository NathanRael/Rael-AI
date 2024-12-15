import {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {uploadFile} from "@/api/fileApi.ts";

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const useFile = (file : File | null) => {
    const [uploadedImage, setUploadedImage] = useState('');
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [fileId, setFileId] = useState<string | null>(null);
    
    const  {mutateAsync : uploadFileMutation} = useMutation({
        mutationFn : uploadFile,
        onSuccess : data => {
            setFileId(data.id)
            setStatus('success');
        },
        onError : error => {
            console.error(`Error while uploading file : ${error}`)
            setStatus('error');
        }
    })
    
   
    const handleFileUpload = async (file : File | null) => {
        if (!file) return
        setStatus('uploading');
        
       
        try {
            return await uploadFileMutation(file)
        } catch (error) {
            console.error(`Error while uploading file : ${error}`)
        }
    }


    useEffect(() => {
        if (!file) return
        setUploadedImage(URL.createObjectURL(file))
    }, [file]);
    
    return {
        handleFileUpload,
        uploadedImage,
        setUploadedImage,
        status,
        fileId,
    }
}

export default useFile