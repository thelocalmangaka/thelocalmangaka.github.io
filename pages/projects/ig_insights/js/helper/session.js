import {APP_ID} from "../constants/facebook.js";
import {ACCESS_TOKEN_COOKIE_NAME} from "../constants/cookie.js";

export function changeView(isLoggedIn) {
    document.getElementById('login').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('loggedIn').style.display = isLoggedIn ? 'block' : 'none';
    document.getElementById('loader').style.display = 'none';
    document.getElementById('loader_message').style.display = 'none';
    document.getElementById('calculated').style.display = 'none';
}

export function saveCookie(authResponse) {
    // After login, Facebook redirects back to our URL but with a token appended at the end
    const hash = window.location.hash.substring(1);
    const urlParams = hash.split('&').reduce(function (res, item) {
        let parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
    }, {});
    let accessToken = urlParams['access_token'];
    let expiration = urlParams['data_access_expiration_time'];
    // The token is also accessible from status check response
    if ((accessToken === null || accessToken === undefined)
        && authResponse !== null && authResponse !== undefined) {
        accessToken = authResponse.accessToken;
        expiration = authResponse.data_access_expiration_time;
    }
    if (accessToken !== null && accessToken !== undefined && accessToken !== ''
        && expiration !== null && expiration !== undefined && expiration !== '') {
        console.log("Saving cookie...");
        $.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { expiration: new Date(expiration) });
        console.log(`Cookie saved at ${ACCESS_TOKEN_COOKIE_NAME}.`);
    }
}

export function deleteCookies() {
    // FB.logout() has an issue where this cookie is not deleted after logout,
    // causing later logins to fail.
    // cookie has name iterations of fblo_APP_ID and fbsr_APP_ID.
    $.each(document.cookie.split(/; */), function()  {
        const splitCookie = this.split('=');
        if (splitCookie[0].includes(APP_ID) || splitCookie[0].includes(ACCESS_TOKEN_COOKIE_NAME)) {
            console.log("Deleting cookie...");
            $.cookie(splitCookie[0], null, {expires: -1});
            $.removeCookie(splitCookie[0], { path: '/' });
            console.log(`Cookie deleted at ${splitCookie[0]}.`);
        }
    });
}