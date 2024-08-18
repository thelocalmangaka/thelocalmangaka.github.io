import {APP_ID} from "./constants/facebook.js";

export function deleteCookie() {
    console.log("Deleting cookie...");
    document.cookie = 'fblo_' + APP_ID + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log("Cookie deleted.");
}

export function logout() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('message').innerText = '';
    console.log("Logging out");
    FB.logout();
    console.log("Logged out");
    deleteCookie();
}