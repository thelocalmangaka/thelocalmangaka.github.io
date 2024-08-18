import {deleteCookies, hideLogin} from "../helper/login.js";

function logoutOfFacebook() {
    hideLogin(false);
    console.log("Logging out...");
    FB.logout();
    console.log("Logged out");
    deleteCookies();
}

window.logoutOfFacebook = logoutOfFacebook;