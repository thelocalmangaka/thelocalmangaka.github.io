function logout() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('message').innerText = '';
    FB.logout();
}