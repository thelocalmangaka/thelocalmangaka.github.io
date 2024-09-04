// export const APP_ID = "501129039057747";
import {APP_ID_COOKIE} from "./cookie.js";

const APP_ID = $.cookie(APP_ID_COOKIE);
export const APP_LOGIN_URL =`https://www.facebook.com/dialog/oauth?scope=instagram_basic,instagram_manage_insights,pages_read_engagement,pages_show_list&client_id=${APP_ID}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${window.location.origin + window.location.pathname}&response_type=token`;

export const GRAPH_API = "https://graph.facebook.com/";

export const INSIGHT_KEYS = [
    "likes","comments","saved","shares","total_interactions",
    "video_views","clips_replays_count","plays","ig_reels_aggregated_all_plays_count","ig_reels_video_view_total_time",
    "follows","impressions","profile_activity","profile_visits"
]

