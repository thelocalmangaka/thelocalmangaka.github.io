function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
        testAPI();
    } else {
        document.getElementById('login').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
    }
}

function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '501129039057747',
        cookie     : true,                     // Enable cookies to allow the server to access the session.
        xfbml      : true,                     // Parse social plugins on this webpage.
        version    : 'v20.0'           // Use this Graph API version for this call.
    });

    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);        // Returns the login status.
    });
};

function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('message').innerText =
            'Thanks for logging in, ' + response.name + '!';
    });
}

function login() {
    window.location.replace('https://www.facebook.com/dialog/oauth?scope=instagram_basic,instagram_manage_insights,pages_read_engagement,pages_show_list&client_id=501129039057747&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=https://thelocalmangaka.github.io/pages/projects/ig_insights/index.html&response_type=token');
}