

export const TIKTOK_URL = 'https://www.tiktok.com/en/'
export const RECOMMENT_URL = '/api/recommend/item_list'
export const SCRAPER_LIMIT = 20;
export const KAFKA_TOPIC = 'social-media-posts'

const SEARCH_INPUT = '#app-header form.search-input'
const SEARCH_BUTTON = '#app-header button[data-e2e="search-box-button"]'
const LOGIN_CLOSE_BUTTON = '#login-modal div[role="button"]'
const POST_CONTAINER = 'div[data-e2e="recommend-list-item-container"]'
const ACCOUNT_NAME = 'a.avatar-anchor'
const VIDEO_CAPTION = 'div[data-e2e="video-desc"] > span:first-child'
const VIDEO_HASHTAG = 'a[data-e2e="search-common-link"]'
const LIKE_COUNTER = 'strong[data-e2e="like-count"]'
const SAVE_COUNTER = 'strong[data-e2e="undefined-count"]'
const VIDEO_CONTROL = 'div.tiktok-web-player'
const CONTENT_WRAPPER = '#main-content-homepage_hot'


const TIKTOK_UI = {
    SEARCH_INPUT,
    SEARCH_BUTTON,
    LOGIN_CLOSE_BUTTON,
    POST_CONTAINER,
    ACCOUNT_NAME,
    VIDEO_CAPTION,
    VIDEO_HASHTAG,
    VIDEO_CONTROL,
    LIKE_COUNTER,
    SAVE_COUNTER,
    CONTENT_WRAPPER
} as const

export default TIKTOK_UI;