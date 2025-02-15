// export const APP_ID = "501129039057747";
import {APP_ID_COOKIE} from "./cookie.js";

const APP_ID = $.cookie(APP_ID_COOKIE);
export const APP_LOGIN_URL =`https://www.facebook.com/dialog/oauth?scope=business_management,instagram_basic,instagram_manage_insights,pages_read_engagement,pages_show_list&client_id=${APP_ID}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${window.location.origin + window.location.pathname}&response_type=token`;

export const GRAPH_API = "https://graph.facebook.com/";

export const MEDIA_TYPE = {
    VIDEO: 'VIDEO'
}

export const INSIGHT = {
    LIKES: "likes",
    COMMENTS: "comments",
    SAVED: "saved",
    SHARES: "shares",
    TOTAL_INTERACTIONS: "total_interactions",
    // NOTE: video_views was deprecated after v21.0
    // VIDEO_VIEWS: "video_views",
    // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
    // REPLAYS: "clips_replays_count",
    // PLAYS: "plays",
    // TOTAL_PLAYS: "ig_reels_aggregated_all_plays_count",
    VIEWS: "views",
    TOTAL_WATCH_TIME: "ig_reels_video_view_total_time",
    FOLLOWS: "follows",
    IMPRESSIONS: "impressions",
    PROFILE_ACTIVITY: "profile_activity",
    PROFILE_VISITS: "profile_visits"
}

export const INSIGHT_KEYS = Object.values(INSIGHT);

