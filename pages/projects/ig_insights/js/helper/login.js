import {APP_ID} from "../constants/facebook.js";

export function hideLogin(isLoggedIn) {
    document.getElementById('login').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('logout').style.display = isLoggedIn ? 'block' : 'none';
    document.getElementById('message').innerText = isLoggedIn ? 'block' : 'none';
}

export function deleteCookie() {
    console.log("Deleting cookie...");
    document.cookie = 'fblo_' + APP_ID + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log("Cookie deleted.");
}