import {GRAPH_API} from "../constants/facebook.js";
import {ACCESS_TOKEN_COOKIE_NAME} from "../constants/cookie.js";

async function fbGet(path) {
    let getPath = GRAPH_API + path;
    const token = await $.cookie(ACCESS_TOKEN_COOKIE_NAME);
    if (getPath.includes("?")) {
        getPath += `&access_token=${token}`;
    } else {
        getPath += `?access_token=${token}`;
    }
    return await fetch(getPath)
        .then(res => res.json());
}

async function getListOfMedia(businessAccountIds) {
    let mediaMap = {};
    for (const businessAccountId of businessAccountIds) {
        console.log(`Getting media for businessAccountId: ${businessAccountId}...`);
        const response = await fbGet(`/${businessAccountId}?fields=media`);
        console.log(response);

        await FB.api(`/${businessAccountId}?fields=media`, async function(response) {
            console.log(response);
            const media = response.media;
            mediaMap[businessAccountId] = [];
            mediaMap[businessAccountId].push(...media.data);
            console.log(`Media length: ${mediaMap[businessAccountId].length}`);

            let next = media.paging.next;
            while (next !== null && next !== undefined) {
                console.log(`Getting more media for businessAccountId: ${businessAccountId}...`)
                const nextResponse = await fetch(next)
                    .then(res => res.json());
                console.log(nextResponse);
                mediaMap[businessAccountId].push(...nextResponse.data);
                next = nextResponse.paging.next;
                console.log(`Media length: ${mediaMap[businessAccountId].length}`);
            }
        });
    }
    return mediaMap;
}

async function getBusinessAccountIds(pageIds) {
    let businessAccountIds = [];
    for (const pageId of pageIds) {
        console.log(`Getting business account id for pageId: ${pageId}...`);
        const response = await fbGet(`/${pageId}?fields=instagram_business_account`);
        console.log(response);
        businessAccountIds.push(response.instagram_business_account.id);
    }
    return businessAccountIds;
}

async function getPageIds() {
    let pageIds = [];
    console.log("Getting accounts...");
    const response = await fbGet('/me/accounts');
    console.log(response);
    for (const page of response.data) {
        pageIds.push(page.id);
    }
    return pageIds;
}

export async function insight() {
    const pageIds = await getPageIds();
    const businessAccountIds = await getBusinessAccountIds(pageIds);
    const mediaMap = await getListOfMedia(businessAccountIds);
}

window.insight = insight;