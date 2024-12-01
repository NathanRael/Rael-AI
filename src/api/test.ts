import axios from "axios";
import {BASE_URL} from "@/constants";


// export async function* streamFetch(fetchCall: Promise<any>) {
//     const response = await fetchCall
//
//     const reader = response.body.getReader();
//
//     while (true) {
//         // wait for next encoded chunk
//         const {done, value} = await reader.read();
//         // check if stream is done
//         if (done) break;
//         // Decodes data chunk and yields it
//         yield (new TextDecoder().decode(value));
//     }
//
//     // Object.entries(response.data => response.data )
//     // console.log(response.data);
// }
//



export async function fetchStreamedResponse(onChange : (data: string) => void){
    const response = await fetch(`${BASE_URL}/streamed`, {
        method: "POST",
    });

    if (!response.body) {
        console.error('No response body available.');
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        onChange(chunk)
    }
}