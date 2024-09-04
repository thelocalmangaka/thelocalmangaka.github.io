import {APP_ID_COOKIE} from "../constants/cookie.js";
import {GRAPH_API} from "../constants/facebook.js";
import {hasError} from "../helper/log.js";
import {deleteCookies} from "../helper/session.js";
import {logoutOfFacebook} from "./logout.js";

const appIdElement = document.getElementById("appId");
appIdElement.addEventListener("keydown", async function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        await saveAppId();
    }
});

export function enableLogin() {
    const APP_ID = $.cookie(APP_ID_COOKIE);
    document.getElementById("login_message").innerHTML = `<i>App ID registered as: <b>${APP_ID}</b></i>&nbsp;&nbsp;<button onclick="removeAppId()">Unregister</button>`;
    document.getElementById("login_button").disabled = false;
}

export function disableLogin() {
    document.getElementById("login_message").innerHTML = "<i>Please submit your Facebook Developer Application ID before Facebook login is enabled.</i>";
    document.getElementById("login_button").disabled = true;
}


async function verifyAppId(appId) {
    const response = await fetch(GRAPH_API + appId)
        .then(res => res.json());
    return !hasError(response);
}

async function saveAppId() {
    const appId = appIdElement.value;
    if (await verifyAppId(appId)) {
        // If already logged in, logout of Facebook to use new AppID
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {   // Logged into your webpage and Facebook.
                logoutOfFacebook();
            }
        });
        console.log("Saving app ID cookie...");
        $.cookie(APP_ID_COOKIE, appId);
        console.log(`App ID cookie saved at ${APP_ID_COOKIE}.`);
        document.getElementById("appIdError").innerHTML = "";
        enableLogin();
        window.location.reload();
    } else {
        document.getElementById("appIdError").innerHTML = "Invalid App Id!";
    }
}

function removeAppId() {
    deleteCookies();
    window.location.reload();
}

window.saveAppId = saveAppId;
window.removeAppId = removeAppId;