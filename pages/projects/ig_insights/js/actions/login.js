import {APP_LOGIN_URL} from "../constants/facebook.js";
import {changeView, saveTokenCookie} from "../helper/session.js";
import {APP_ID_COOKIE} from "../constants/cookie.js";
import {disableLogin, enableLogin} from "./app_id.js";

const APP_ID = $.cookie(APP_ID_COOKIE);
if (APP_ID !== null && APP_ID !== undefined) {
    enableLogin();
} else {
    disableLogin();
}

function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('Checking login status...');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        changeView(true);
        getName();
        saveTokenCookie(response.authResponse);
    } else {
        console.log("Not logged in. If problem persists, usually can be resolved by clearing third party cookies then trying again. (Inspect -> Application -> Storage -> 'Clear site data' (including third-party cookies))");
        changeView(false);
    }
}

function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : APP_ID,
        cookie     : true,                     // Enable cookies to allow the server to access the session.
        xfbml      : true,                     // Parse social plugins on this webpage.
        version    : 'v20.0'           // Use this Graph API version for this call.
    });

    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);        // Returns the login status.
    });
};

function getName() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('welcome').innerText =
            'Thanks for logging in, ' + response.name + '!';
    });
}

function loginToFacebook() {
    window.location.replace(APP_LOGIN_URL);
}

window.loginToFacebook = loginToFacebook;