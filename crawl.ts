import { JSDOM } from 'jsdom';

export async function crawlPage(
    baseURL: string,
    currentURL: string,
    pages: Record<string, number>
): Promise<Record<string, number>> {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`actively crawling: ${currentURL}`);

    try {
        const resp = await fetch(currentURL);

        if (resp.status > 399) {
            console.log(
                `error in fetch with status: ${resp.status} on page ${currentURL}`
            );
            return pages;
        }

        const contentType = resp.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            console.log(
                `non-html response: content type ${contentType}, on page ${currentURL}`
            );
            return pages;
        }

        const htmlBody = await resp.text();
        const nextURLs = getURLsFromHTML(htmlBody, baseURL);

        for (const nextUrl of nextURLs) {
            pages = await crawlPage(baseURL, nextUrl, pages);
        }
        return pages;
    } catch (err) {
        if (err instanceof Error) {
            console.log(`error in fetch: ${err.message}, on page ${currentURL}`);
        }
        return pages;
    }
}

export function getURLsFromHTML(htmlBody: string, baseURL: string): string[] {
    const urls: string[] = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        const href = linkElement.getAttribute('href');
        if (!href) continue;

        try {
            const urlObj = new URL(href.startsWith('/') ? `${baseURL}${href}` : href);
            urls.push(urlObj.href);
        } catch (err) {
            if (err instanceof Error) {
                console.log(`error with URL: ${err.message}`);
            }
        }
    }
    return urls;
}

export function normalizeURL(urlString: string): string {
    const urlObj = new URL(urlString);
    let hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if (hostPath.endsWith('/')) {
        hostPath = hostPath.slice(0, -1);
    }
    return hostPath;
}
