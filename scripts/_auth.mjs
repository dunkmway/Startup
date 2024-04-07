import { httpRequest, removeAllChildNodes } from "./_helpers.mjs";

const privatePages = [
    'new-place.html',
    'profile.html'
]

const publicPages = [
    'login.html'
]

initialize();

async function initialize() {
    checkAuth();
    document.addEventListener('DOMContentLoaded', renderHeader);
}

async function checkAuth() {
    const user = await getCurrentUser();
    const paths = location.pathname.split('/');
    const currentPage = paths[paths.length - 1];
    
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

async function renderHeader() {
    const menu = document.querySelector('header menu');
    if (!menu) return;
    removeAllChildNodes(menu);

    const user = await getCurrentUser();
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

export async function getCurrentUser() {
    return httpRequest('/api/auth/me');
}

export async function loginUser(username, password) {
    return httpRequest("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
    });
}

export async function createUser(username, password) {
    return httpRequest("/api/auth/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
    });
}

export async function signOutUser() {
    await httpRequest("/api/auth/logout", {
        method: "POST",
    })
    await checkAuth();
    await renderHeader();
}