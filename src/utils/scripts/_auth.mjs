import { httpRequest } from "./_helpers.mjs";

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
}