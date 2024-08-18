import {APP_ID} from "../constants/facebook.js";
import {FB_TOKEN_COOKIE_KEY} from "../constants/cookie";

export function hideLogin(isLoggedIn) {
    document.getElementById('login').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('logout').style.display = isLoggedIn ? 'block' : 'none';
    document.getElementById('message').style.display = isLoggedIn ? 'block' : 'none';
}

export function deleteCookies() {
    console.log("Deleting cookies...");
    $.removeCookie('fblo_' + APP_ID, { path: '/' });
    $.removeCookie(FB_TOKEN_COOKIE_KEY, { path: '/' });
    console.log("Cookie deleted.");
}