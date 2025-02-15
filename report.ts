export function printReport(pages: Record<string, number>): void {
    console.log('======');
    console.log('REPORT');
    console.log('======');
    const sortedPages = sortPages(pages);
    for (const [url, hits] of sortedPages) {
        console.log(`Found ${hits} links to page ${url}`);
    }
    console.log('======');
    console.log('END OF REPORT');
    console.log('======');
}

export function sortPages(pages: Record<string, number>): [string, number][] {
    const pagesArr: [string, number][] = Object.entries(pages);
    pagesArr.sort((a, b) => b[1] - a[1]);
    return pagesArr;
}
