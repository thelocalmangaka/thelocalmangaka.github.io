import {APP_ID, APP_LOGIN_URL} from "../constants/facebook.js";
import {deleteCookies, hideLogin, saveCookie} from "../helper/login.js";

function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        hideLogin(true);
        getName();
        saveCookie();
    } else {
        hideLogin(false);
        deleteCookies();
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