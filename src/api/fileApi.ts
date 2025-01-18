import {apiClient} from "@/utils/api";

export interface UploadedFile {
    id : string;
    file_name: string;
    file_size: number;
    file_type: string;
}
export const uploadFile = async (file : File) => {
    const formData = new FormData();
    formData.append('file', file)
    const response = await apiClient.post<UploadedFile>(`/api/files/upload`, formData, {
        headers : {
            "Content-Type": "multipart/form-data",
        },
    })
    
    if (response.status !== 200)
        throw new Error(response.statusText)
    
    return response.data;
}

export const downloadFile = async (file_id : string) => {
    const response = await apiClient.get(`/api/files/${file_id}`, {
        responseType : 'blob'
    });
    
    if (response.status !== 200)
        throw new Error(response.statusText);
    
    const blob = await response.data
    
    return URL.createObjectURL(blob);
} 