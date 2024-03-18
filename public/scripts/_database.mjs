import { getCurrentUser } from "./_auth.mjs";

function addUserHeader(headers = {}) {
    const user = getCurrentUser()?.id;
    if (user) {
        headers.user = user
    }
    return headers
}

export async function saveDoc(collection, id, data) {
    const url = id ? `/api/database/${collection}/${id}` : `/api/database/${collection}`;
    const response = await fetch(url, {
        method: "POST",
        headers: addUserHeader({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function getDoc(collection, id) {
    const response = await fetch(`/api/database/${collection}/${id}`, {
        headers: addUserHeader()
    });
    return await response.json();
}

export async function deleteDoc(collection, id) {
    const response = await fetch(`/api/database/${collection}/${id}`, {
        method: "DELETE",
        headers: addUserHeader()
    });
    return await response.json();
}

export async function query(collection, ...conditions) {
    let path = `/api/database/${collection}?`;
    for (const query of conditions) {
        path += query + '&';
    }
    const response = await fetch(path, {
        headers: addUserHeader()
    });
    return await response.json();
}

export function where(field, operator, value) {
    return `${field}=${operator}_${value}`
}