import {GRAPH_API} from "../constants/facebook.js";
import {ACCESS_TOKEN_COOKIE_NAME} from "../constants/cookie.js";
import {createDownloadButton, createInsight, createTable, createTableHtml} from "../helper/table.js";

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

async function getInsights(mediaMap) {
    const insights = [];
    // Get insight of every media
    // Map every insight list to a businessAccountId
    for (const businessAccountId of mediaMap.businessAccountIds) {
        const mediaList = mediaMap[businessAccountId];
        const length = mediaList.length;
        let i = 1;
        for (const media of mediaList) {
            const id = media.id;
            console.log(`Getting insights for mediaId: ${id}, ${i} of ${length}...`);
            i = i + 1;
            // metrics available to all media types
            const response = await fbGet(`${id}/insights?metric=likes,comments,saved,shares,total_interactions`);
            console.log(response);

            // NOTE: It currently isn't possible to get a media's type from Facebook's graph API.
            // It is available from Instagram's Basic Display API, which is a different set of permissions requiring a separate Instagram login and app creation.
            // So instead, I will just call for all metrics, and allow calls to fail.

            // video metrics
            console.log(`Getting video insights for mediaId: ${id}...`);
            const videoResponse = await fbGet(`${id}/insights?metric=video_views,clips_replays_count,plays,ig_reels_aggregated_all_plays_count,ig_reels_video_view_total_time`);
            console.log(videoResponse);
            // post metrics
            console.log(`Getting post insights for mediaId: ${id}...`);
            const postResponse = await fbGet(`${id}/insights?metric=follows,impressions,profile_activity,profile_visits`);
            console.log(postResponse);
            insights.push(createInsight(id, response, videoResponse, postResponse));
        }
    }
    return insights;
}

async function getListOfMedia(businessAccountIds) {
    let mediaMap = {};
    mediaMap.businessAccountIds = businessAccountIds;
    // Get list of all media, mapped to each businessAccountId
    for (const businessAccountId of businessAccountIds) {
        console.log(`Getting media for businessAccountId: ${businessAccountId}...`);
        const response = await fbGet(`/${businessAccountId}?fields=media`);
        console.log(response);

        const media = response.media;
        mediaMap[businessAccountId] = [];
        mediaMap[businessAccountId].push(...media.data);
        console.log(`Media length: ${mediaMap[businessAccountId].length}`);

        // results are paginated, based on existence of "next" variable
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
    document.getElementById('loader').style.display = 'block';
    const pageIds = await getPageIds();
    const businessAccountIds = await getBusinessAccountIds(pageIds);
    const mediaMap = await getListOfMedia(businessAccountIds);
    const insights = await getInsights(mediaMap);
    const table = createTable(insights);
    document.getElementById('loader').style.display = 'none';
    createTableHtml(table);
    createDownloadButton(table);
}

window.insight = insight;