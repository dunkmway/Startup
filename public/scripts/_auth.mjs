const privatePages = [
    'new-place.html',
    'profile.html'
]

const publicPages = [
    'login.html'
]

checkAuth();
document.addEventListener('DOMContentLoaded', renderHeader)

function checkAuth() {
    const user = getCurrentUser();
    const paths = location.pathname.split('/');
    const currentPage = paths[paths.length - 1]
    
    if (!user && privatePages.includes(currentPage)) {
        // unauthorized
        location.replace('login.html');
        return;
    }
    
    if (user && publicPages.includes(currentPage)) {
        // already signed in
        location.replace('profile.html');
        return;
    }
}

function renderHeader() {
    const menu = document.querySelector('header menu');
    if (!menu) return;

    const user = getCurrentUser();
    if (user) {
        const profile = document.createElement('li');
        profile.textContent = user.username;
        profile.addEventListener('click', () => location.href = 'profile.html');
        menu.appendChild(profile);

        const signOut = document.createElement('li');
        signOut.textContent = 'Sign Out';
        signOut.addEventListener('click', signOutUser);
        menu.appendChild(signOut);

    } else {
        const logIn = document.createElement('li');
        logIn.textContent = 'Log In';
        logIn.addEventListener('click', () => location.href = 'login.html');
        menu.appendChild(logIn);
    }
}

export function getCurrentUser() {
    const userString = localStorage.getItem('user');
    return userString && JSON.parse(userString);
}

function signOutUser() {
    localStorage.removeItem('user');
    checkAuth();
    renderHeader();
}