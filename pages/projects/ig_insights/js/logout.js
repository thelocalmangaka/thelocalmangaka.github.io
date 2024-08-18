function logout() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('message').innerText = '';
    FB.logout();
    document.cookie = 'fblo_501129039057747=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}