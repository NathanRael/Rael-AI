export const copyToClipboard = async (text: string, callback : () => void) => {
    try {
        await window.navigator.clipboard.writeText(text);
        console.log("Copied to clipboard");
        callback()
    } catch (err) {
        console.error(
            "Unable to copy to clipboard.",
            err
        );
    }
}
