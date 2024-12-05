import {useRef, useState} from "react";
import {downloadOllamaModels} from "@/api/ollamaModelsApi.ts";


const useDownloadOllamaModels = () => {
    const downloadAbortController = useRef<AbortController | null>(null);
    const [progress, setProgress] = useState(0);
    const [downloading, setDownloading] = useState(false);
    const [downloadedModels, setDownloadedModels] = useState<Record<string, boolean>[]>([{}]);

    const handleDownloaded = (modelName: string, downloaded: boolean) => {
        setDownloadedModels(prev => [...prev, {[modelName]: downloaded}])
    }

    const downloadModel = async (modelName: string) => {
        setDownloading(true)
        // console.log(modelName)
        handleDownloaded(modelName, false)
        try {
            downloadAbortController.current = new AbortController();

            await downloadOllamaModels({
                model_name: modelName,
                abortController: downloadAbortController,
                onchange: ({total, completed, status}) => {
                    let downloadProgress = 0
                    
                    if (status.trim() !== "pulling manifest".trim()) {
                        downloadProgress = (completed * 100) / total
                    }
                    

                    if (status === 'success')
                        handleDownloaded(modelName, true)
                    
                    if (downloadProgress < 100) 
                        setProgress(downloadProgress.toFixed(0) as unknown as number)
                },
            });
        } catch (e) {
            downloadAbortController.current?.abort('Error while downloading model');
            console.error(e)
        } finally {
            downloadAbortController.current = null;
            setDownloading(false)
        }
    }

    const handleAbort = () => {
        if (downloadAbortController.current) {
            downloadAbortController.current.abort();
        } else {
            console.log('No active download to abort');
        }
    };


    return {
        handleAbort,
        downloadModel,
        progress,
        downloading,
        downloadedModels
    }

}

export default useDownloadOllamaModels