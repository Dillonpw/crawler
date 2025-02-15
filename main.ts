import { printReport } from './report.ts';
import { crawlPage } from './crawl.ts';

async function main() {
    if (process.argv.length < 3) {
        console.log('Usage: npm start <website_url>');
        process.exit(1);
    }

    let baseURL = process.argv[2];

    // Ensure baseURL starts with http:// or https://
    if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
        baseURL = `https://${baseURL}`;
    }

    console.log(`Starting crawl of ${baseURL}`);

    const pages = await crawlPage(baseURL, baseURL, {});
    console.log(pages);

    printReport(pages);
}

main();
