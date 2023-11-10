
import puppeteer from "puppeteer-extra"
import { Page } from "puppeteer"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import TIKTOK_UI, { RECOMMENT_URL, TIKTOK_URL } from "./constants";

puppeteer.use(StealthPlugin());
const puppeteerConfig = { headless: true, args: ['--no-sandbox'] }

/**
 * Closes login modal if there is any, non-blocking.
 * @param page the page to scrape
 */
async function closeLoginModal(page: Page) {
    const loginModal = await page.$$(TIKTOK_UI.LOGIN_CLOSE_BUTTON);
    if (loginModal.length > 0) {
        await page.click(TIKTOK_UI.LOGIN_CLOSE_BUTTON)
    }
}

/**
 * Scrolls page to the end of the current content list.
 * @param page the page to scrape
 */
async function ScrollToEnd(page: Page) {
    console.log('started scrolling')
    const [contentWrapperEl] = await page.$$(TIKTOK_UI.CONTENT_WRAPPER)
    const videoItems = await contentWrapperEl.$$(TIKTOK_UI.POST_CONTAINER)
    const lastItem = videoItems[videoItems.length - 1];
    await lastItem.evaluate(el => el.scrollIntoView({ behavior: "instant", block: "end" }))
    console.log('done scrolling')
}

/**
 * Constructs a video URL based on available metadata.
 * @param authorId the unique author id "finesseusstudios"
 * @param videoId the unique video id "12793472423"
 * @returns the constructed video URL
 */
function getVideoURL(authorId: string, videoId: string): string {
    return `https://www.tiktok.com/@${authorId}/video/${videoId}`
}

/**
 * Wait for recomandation API to return a list video, blocking.
 * @param page the page to scrape
 * @returns list of parsed video metadata
 */
async function waitAndGetVideoList(page: Page): Promise<[SocialMediaPost[], boolean]> {
    try {
        const videoListResp = await page.waitForResponse(response => response.url().includes(RECOMMENT_URL) && response.status() === 200)
        const videoListRespJson = await videoListResp.json();
        const hasMore = videoListRespJson.hasMore ?? false;
        const videoList = videoListRespJson.itemList.map((item: any) => (
            {
                url: getVideoURL(item.author.uniqueId, item.id),
                account: item.author.uniqueId,
                views: item.stats.playCount,
                Likes: item.stats.diggCount,
                Saved: item.stats.collectCount,
                caption: item.desc,
                posted: new Date(item.createTime),
                tags: (item.contents[0]?.textExtra ?? []).map((extra: any) => extra.hashtagName),
                collected: new Date(),
            } as SocialMediaPost
        ))
        console.log(`retrieved ${videoList.length} videos`)
        return [videoList, hasMore];
    } catch (e) {
        return [[], false]
    }
}


/**
 * Scrapes trending post on the default "for you" page.
 * @returns a list of scrapped videos
 */
async function scrapeTrendingPosts(limit: number): Promise<SocialMediaPost[]> {

    let result: SocialMediaPost[] = []
    await puppeteer.launch(puppeteerConfig).then(async browser => {
        const page = await browser.newPage()
        await page.setViewport({ width: 1427, height: 600 })
        let hasMoreVideos = true;

        try {
            await page.goto(TIKTOK_URL)
            const [newVideos, hasMore] = await waitAndGetVideoList(page);
            hasMoreVideos = hasMore
            result.push(...newVideos)
            await closeLoginModal(page);

            while (result.length < limit && hasMoreVideos) {
                const [, resp] = await Promise.all([
                    ScrollToEnd(page),
                    waitAndGetVideoList(page)
                ])
                const [newVideos, hasMore] = resp
                result.push(...newVideos)
                await closeLoginModal(page);
                hasMoreVideos = hasMore
            }
        } catch (e) {
            console.log(e)
        }
    })

    console.log(`Scrapped ${result.length} posts`)
    return result
}

const scraper = {
    scrapeTrendingPosts
}

export default scraper;
