import { getDoc } from "./_database.mjs";
import { removeAllChildNodes } from "./_helpers.mjs";

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
    removeAllChildNodes(menu);

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
    const userString = localStorage.getItem('current_user');
    return userString && JSON.parse(userString);
}

export async function setCurrentUser(id) {
    const userDoc = await getDoc('users', id);
    const currentUser = {
        id,
        username: userDoc.username
    }
    localStorage.setItem('current_user', JSON.stringify(currentUser));
    return currentUser;
}

export function signOutUser() {
    localStorage.removeItem('current_user');
    checkAuth();
    renderHeader();
}