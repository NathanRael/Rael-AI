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