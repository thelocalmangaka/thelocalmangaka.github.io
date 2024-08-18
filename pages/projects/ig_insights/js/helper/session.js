import {APP_ID} from "../constants/facebook.js";
import {ACCESS_TOKEN_COOKIE_NAME} from "../constants/cookie.js";

export function changeView(isLoggedIn) {
    document.getElementById('login').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('loggedIn').style.display = isLoggedIn ? 'block' : 'none';
}

export function saveCookie() {
    const hash = window.location.hash.substring(1);
    const urlParams = hash.split('&').reduce(function (res, item) {
        let parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
    }, {});
    const accessToken = urlParams['access_token'];
    if (accessToken !== null && accessToken !== undefined && accessToken !== '') {
        console.log("Saving cookie...");
        $.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken);
        console.log("Cookie saved.");
    }
}

export function deleteCookies() {
    console.log("Deleting cookies...");
    console.log(document.cookie);
    $.removeCookie('fblo_' + APP_ID, { path: '/' });
    $.removeCookie(ACCESS_TOKEN_COOKIE_NAME, { path: '/' });
    console.log("Cookies deleted.");
}