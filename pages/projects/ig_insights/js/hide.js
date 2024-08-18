export function hideLogin(isLoggedIn) {
    document.getElementById('login').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('logout').style.display = isLoggedIn ? 'block' : 'none';
    document.getElementById('message').innerText = isLoggedIn ? 'block' : 'none';
}