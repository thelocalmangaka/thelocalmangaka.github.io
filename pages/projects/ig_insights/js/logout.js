import {APP_ID} from "./constants/facebook.js";
import {hideLogin} from "./hide";

export function deleteCookie() {
    console.log("Deleting cookie...");
    document.cookie = 'fblo_' + APP_ID + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log("Cookie deleted.");
}

function logoutOfFacebook() {
    hideLogin(false);
    console.log("Logging out");
    FB.logout();
    console.log("Logged out");
    deleteCookie();
}

window.logoutOfFacebook = logoutOfFacebook;