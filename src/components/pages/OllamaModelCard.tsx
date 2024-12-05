import {Badge, Button, Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Icon} from "rael-ui";
import {OllamaModel} from "@/api/ollamaModelsApi.ts";
import {Check, CheckCircle, ChevronDown, Download, LoaderCircle, StopCircle} from "lucide-react";
import useDownloadOllamaModels from "@/hooks/useDownloadOllamaModels.ts";
import {QueryClient, useQuery} from "@tanstack/react-query";
import {fetchModels} from "@/api/modelsApi.ts";
import {queryKeys} from "@/api/queryKeys.ts";
import {useMemo} from "react";


const OllamaModelCard = ({name, description, link, sizes, capability}: OllamaModel) => {
    const {progress, downloadModel, handleAbort, downloading, downloadedModels} = useDownloadOllamaModels();
    const queryClient = new QueryClient();
    const {data, isLoading} = useQuery({
        queryFn: fetchModels,
        queryKey: [queryKeys.modelList]
    })

    const isModelDownloaded = (modelName: string) => {
        if (isLoading || !data)
            return false
        // console.log(data, modelName)
        const modelJustDownloaded = downloadedModels.some((model) => model[modelName])

        if (modelJustDownloaded)
            queryClient.invalidateQueries([queryKeys.modelList])

        return data.some(item => item.trim().toLowerCase() === modelName.trim().toLowerCase()) || modelJustDownloaded;
    }

    const isAllModelDownloaded = useMemo(() => {
        if (isLoading || !data)
            return false

        return sizes.every(size => {
            const modelName = `${name}:${size}`
            return isModelDownloaded(modelName)
        })
    }, [isLoading, data, sizes, name])


    return (
        <div className={'flex flex-col w-[480px] max-md:w-full gap-6 p-1'}>
            <div className={'flex flex-col gap-4'}>
                <div className={'space-y-2'}>
                    <p onClick={() => window.open(link, '_blank')}
                       className={'text-subtitle font-bold cursor-pointer w-fit  text-black dark:text-white underline'}>{name}</p>
                    <p className={'text-base   text-black dark:text-white/70'}>{description}</p>
                </div>
                <div className={'flex items-center justify-start gap-4 '}>
                    {capability &&
                        <Badge size={'sm'} className={'bg-secondary/80 dark:bg-secondary/50'}>{capability}</Badge>}
                    {sizes?.map((size, index) => (
                        <Badge key={size + index} size={'sm'}
                               className={'bg-primary/80 dark:bg-primary/50'}>{size}</Badge>))}
                </div>
            </div>
            <div>
                {!downloading && <Dropdown>
                    <DropdownTrigger>
                        <div className={'flex'}>
                            {!isAllModelDownloaded &&
                                <Button className={'button-gradient '} radius={'lg'}> Pull model <ChevronDown
                                    size={20}/>
                                </Button>}
                        </div>
                    </DropdownTrigger>
                    <DropdownContent>
                        {sizes.map((size, index) => {
                            const modelName = `${name}:${size}`

                            return (
                                <DropdownItem key={size + index} onClick={() => {
                                    if (!isModelDownloaded(modelName))
                                        downloadModel(modelName)
                                }}>
                                    {isModelDownloaded(modelName) ? <Check size={16}/> : <Download size={16}/>}
                                    {size}
                                </DropdownItem>
                            )
                        })}
                    </DropdownContent>
                </Dropdown>}
                {
                    isAllModelDownloaded &&
                    <div className={'flex items-center justify-start gap-2 font-bold text-base text-green-500'}>
                        <CheckCircle size={20}/>
                        Downloaded
                    </div>
                }

                {
                    downloading && (
                        <div className={'flex items-center justify-start gap-6'}>
                            <div className={'flex items-center justify-start gap-2 font-bold text-base text-primary'}>
                                <LoaderCircle className={'animate-spin'}/>
                                <p className={'text-black dark:text-white'}>{progress}%</p>
                            </div>
                            <Button size={'sm'} variant={'ghost'} onClick={() => handleAbort()}> <StopCircle/> Stop</Button>
                        </div>)
                }
            </div>
        </div>
    );
};

export default OllamaModelCard;