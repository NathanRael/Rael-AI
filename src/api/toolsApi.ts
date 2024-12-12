export interface Tool {
    keyword: string;
    function: string
}

export const tools: Tool[] = [
    {
        keyword: 'search',
        function: 'Online search',
    },
    {
        keyword: 'scrape',
        function: 'Website scraper',
    },
    {
        keyword: 'imagine',
        function: 'Image generator',
    },

] 