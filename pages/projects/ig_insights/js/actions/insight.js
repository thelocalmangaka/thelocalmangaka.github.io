import {APP_TOKEN_URL_PARAM_NAME} from "../constants/facebook";
import {FB_TOKEN_COOKIE_KEY} from "../constants/cookie";

export function calculateInsights() {
    const URL = window.location.search;
    const urlParams = new URLSearchParams(URL);
    const urlToken = urlParams.get(APP_TOKEN_URL_PARAM_NAME);
    if (urlToken !== null && urlToken !== undefined && urlToken !== '') {
        $.cookie(FB_TOKEN_COOKIE_KEY, urlToken);
    }
    const token = $.cookie(FB_TOKEN_COOKIE_KEY);
}