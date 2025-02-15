import {GRAPH_API, MEDIA_TYPE} from "../constants/facebook.js";
import {ACCESS_TOKEN_COOKIE_NAME} from "../constants/cookie.js";
import {
    createAverageHtml,
    createDownloadButton,
    createInsight,
    createTable,
    createTableHtml,
    createTotal,
    createTotalHtml, createVideoAverageHtml
} from "../helper/table.js";
import {hasError, log, logError, logErrorString, logJson} from "../helper/log.js";
import {createCharts} from "./chart.js";

function mask(id) {
    return "••••" + id.substring(id.length-4);
}

async function fbGet(path) {
    let getPath = GRAPH_API + path;
    const token = $.cookie(ACCESS_TOKEN_COOKIE_NAME);
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
        if (window.cancelled) {
            return insights;
        }
        const mediaList = mediaMap[businessAccountId];
        const length = mediaList.length;
        let i = 1;
        for (const media of mediaList) {
            if (window.cancelled) {
                return insights;
            }
            const id = media.id;
            log(`Getting media info for mediaId: ${id}, ${i} of ${length}...`);
            const mediaInfo = await fbGet(`${id}?fields=media_type,permalink,timestamp,username`);
            logJson(mediaInfo);
            if (hasError(mediaInfo)) {
                logError(mediaInfo.error);
            }

            log(`Getting insights for mediaId: ${id}, ${i} of ${length}...`);
            i = i + 1;
            // metrics available to all media types
            const response = await fbGet(`${id}/insights?metric=likes,comments,saved,shares,total_interactions`);
            logJson(response);
            if (hasError(response)) {
                logError(response.error);
            }

            let videoResponse = {};
            let postResponse = {};
            if (!hasError(response) && mediaInfo.media_type === MEDIA_TYPE.VIDEO) {
                // video metrics
                log(`Getting video insights for mediaId: ${id}, ${i} of ${length}...`);
                // NOTE: video_views deprecated after v21.0
                // videoResponse = await fbGet(`${id}/insights?metric=video_views,clips_replays_count,plays,ig_reels_aggregated_all_plays_count,ig_reels_video_view_total_time`);
                // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
                // videoResponse = await fbGet(`${id}/insights?metric=clips_replays_count,plays,ig_reels_aggregated_all_plays_count,ig_reels_video_view_total_time`);
                videoResponse = await fbGet(`${id}/insights?metric=views,ig_reels_video_view_total_time`);
                logJson(videoResponse);
                if (hasError(videoResponse)) {
                    logError(videoResponse.error);
                }
            } else if(!hasError(response)) {
                // post metrics
                log(`Getting post insights for mediaId: ${id}, ${i} of ${length}...`);
                postResponse = await fbGet(`${id}/insights?metric=follows,impressions,profile_activity,profile_visits`);
                logJson(postResponse);
                if (hasError(postResponse)) {
                    logError(postResponse.error);
                }
            }
            insights.push(createInsight(mediaInfo, response, videoResponse, postResponse));
        }
    }
    return insights;
}

async function getListOfMedia(businessAccountIds) {
    let mediaMap = {};
    mediaMap.businessAccountIds = businessAccountIds;
    // Get list of all media, mapped to each businessAccountId
    for (const businessAccountId of businessAccountIds) {
        if (window.cancelled) {
            return mediaMap;
        }
        const maskedId = mask(businessAccountId);
        log(`Getting media for businessAccountId: ${maskedId}...`);
        const response = await fbGet(`/${businessAccountId}?fields=media`);
        logJson(response);
        if (hasError(response)) {
            logErrorString(`Media list not found for ${maskedId}.`);
            logError(response.error);
            continue;
        } else if (response.media === null || response.media === undefined) {
            logErrorString(`Media list not found for ${maskedId}.`);
            continue;
        }

        const media = response.media;
        mediaMap[businessAccountId] = [];
        mediaMap[businessAccountId].push(...media.data);
        log(`Media length: ${mediaMap[businessAccountId].length}`);

        // results are paginated, based on existence of "next" variable
        let next = media.paging !== null && media.paging !== undefined ? media.paging.next : null;
        let retry = 0;
        while (next !== null && next !== undefined) {
            if (window.cancelled) {
                return mediaMap;
            }
            log(`Getting more media for businessAccountId: ${maskedId}...`)
            const nextResponse = await fetch(next)
                .then(res => res.json());
            logJson(nextResponse);
            if (hasError(nextResponse) || nextResponse.data === null || nextResponse.data === undefined) {
                logErrorString("Problem in getting next page of media list.");
                if (hasError(nextResponse)) {
                    logError(nextResponse.error);
                }
                if (retry < 1) {
                    log("Retrying...");
                    retry += 1;
                    continue;
                } else {
                    log("Retry failed. Aborting retry.")
                    break;
                }
            } else {
                retry = 0;
            }
            mediaMap[businessAccountId].push(...nextResponse.data);
            next = nextResponse.paging !== null && nextResponse.paging !== undefined
                ? nextResponse.paging.next : null;
            log(`Media length: ${mediaMap[businessAccountId].length}`);
        }
    }
    return mediaMap;
}

async function getBusinessAccountIds(pageIds) {
    let businessAccountIds = [];
    for (const pageId of pageIds) {
        if (window.cancelled) {
            return businessAccountIds;
        }
        const maskedId = mask(pageId);
        log(`Getting business account id for pageId: ${maskedId}...`);
        const response = await fbGet(`/${pageId}?fields=instagram_business_account`);
        logJson(response);
        if (hasError(response)) {
            logErrorString(`No business account id found for ${pageId}.`);
            logError(response.error);
            continue;
        } else if (response.instagram_business_account === null || response.instagram_business_account === undefined) {
            logErrorString(`No business account id found for ${pageId}.`);
            continue;
        }
        businessAccountIds.push(response.instagram_business_account.id);
    }
    return businessAccountIds;
}

async function getPageIds() {
    let pageIds = [];
    if (window.cancelled) {
        return pageIds;
    }
    log("Getting accounts...");
    const response = await fbGet('me/accounts');
    logJson(response);
    if (hasError(response)) {
        logErrorString("No accounts or page IDs returned for user.");
        logError(response.error);
        return pageIds;
    } else if (response.data === null || response.data === undefined) {
        logErrorString("No accounts page IDs returned for user.");
        return pageIds;
    }
    for (const page of response.data) {
        pageIds.push(page.id);
    }
    return pageIds;
}

export async function insight() {
    window.cancelled = false;
    document.getElementById('loader').style.display = 'block';
    document.getElementById('loader_message').style.display = 'block';
    const pageIds = await getPageIds();
    const businessAccountIds = await getBusinessAccountIds(pageIds);
    const mediaMap = await getListOfMedia(businessAccountIds);
    const insights = await getInsights(mediaMap);
    const totalInsight = createTotal(insights);
    const table = createTable(insights, totalInsight);
    document.getElementById('loader').style.display = 'none';
    document.getElementById('loader_message').style.display = 'none';
    document.getElementById('calculated').style.display = 'block';
    if (window.cancelled) {
        document.getElementById('cancelled_message').style.display = "block";
    } else {
        document.getElementById('cancelled_message').style.display = "none";
    }
    createTableHtml(table);
    createTotalHtml(totalInsight);
    createAverageHtml(totalInsight, insights.length);
    createVideoAverageHtml(totalInsight, insights);
    createDownloadButton(table);
    createCharts();
}

window.insight = insight;