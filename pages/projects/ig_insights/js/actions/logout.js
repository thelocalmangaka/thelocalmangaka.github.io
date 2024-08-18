import {deleteCookie, hideLogin} from "../helper/login.js";

function logoutOfFacebook() {
    hideLogin(false);
    console.log("Logging out...");
    FB.logout();
    console.log("Logged out");
    deleteCookie();
}

window.logoutOfFacebook = logoutOfFacebook;