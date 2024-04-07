import { httpRequest } from "./_helpers.mjs";

export async function saveDoc(collection, id, data) {
    const url = id ? `/api/database/${collection}/${id}` : `/api/database/${collection}`;
    return await httpRequest(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

export async function getDoc(collection, id) {
    return await httpRequest(`/api/database/${collection}/${id}`);
}

export async function deleteDoc(collection, id) {
    return await httpRequest(`/api/database/${collection}/${id}`, {
        method: "DELETE"
    });
}

export async function query(collection, ...conditions) {
    let path = `/api/database/${collection}?`;
    for (const query of conditions) {
        path += query + '&';
    }
    return await httpRequest(path);
}

export function where(field, operator, value) {
    return `${field}|${operator}=${JSON.stringify(value)}`
}