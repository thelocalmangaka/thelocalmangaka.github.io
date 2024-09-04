import {deleteCookies, changeView} from "../helper/session.js";

export function logoutOfFacebook() {
    changeView(false);
    console.log("Logging out...");
    FB.logout();
    console.log("Logged out");
    deleteCookies();
}

window.logoutOfFacebook = logoutOfFacebook;