export const copyToClipboard = async (text: string, callback : () => void) => {
    try {
        await window.navigator.clipboard.writeText(text);
        // console.log("Copied to clipboard");
        callback()
    } catch (err) {
        console.error(
            "Unable to copy to clipboard.",
            err
        );
    }
}


export const limitTextLen = (text : string, limit : number = 20 )  => {
    return text.length >= limit ? text.slice(0,limit) + '...' : text;
}

export const isModelExist = (modelName: string, models : string[]) => {
    return models.some(model => model.toLowerCase().includes(modelName))
}

export const formatName = (name : string) => {
    const splitedName = name?.split(' ');

    return splitedName?.length > 1 ? splitedName[0][0].toUpperCase() + splitedName[1][0].toUpperCase() : splitedName[0][0].toUpperCase();
}