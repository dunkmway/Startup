export async function saveDoc(collection, id, data) {
    const url = id ? `/api/database/${collection}/${id}` : `/api/database/${collection}`; 
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function getDoc(collection, id) {
    const response = await fetch(`/api/database/${collection}/${id}`);
    return await response.json();
}

export async function deleteDoc(collection, id) {
    const response = await fetch(`/api/database/${collection}/${id}`, {
        method: "DELETE"
    });
    return await response.json();
}

export async function query(collection, ...conditions) {
    let path = `/api/database/${collection}?`;
    for (const query of conditions) {
        path += query + '&';
    }
    const response = await fetch(path);
    const data =  await response.json();
    const array = [];
    for (const docID in data) {
        array.push({
            id: docID,
            collection: data[docID].collection,
            data: data[docID].data
        })
    }
    return array;
}

export function where(field, operator, value) {
    return `${field}=${operator}_${value}`
}