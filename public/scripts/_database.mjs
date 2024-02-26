export async function saveDoc(collection, id, data) {
    // save the doc
    localStorage.setItem(id, JSON.stringify(data));

    // update the collection array
    const collectionString = localStorage.getItem(collection) ?? "[]";
    let collectionIDs = JSON.parse(collectionString);
    if (!collectionIDs.includes(id)) {
        collectionIDs.push(id);
    }
    localStorage.setItem(collection, JSON.stringify(collectionIDs));
}


export async function getDoc(id) {
    const dataString = localStorage.getItem(id);
    if (!dataString) {
        return {
            id,
            data: null
        }
    }

    return {
        id,
        data: JSON.parse(dataString)
    };
}

export async function deleteDoc(collection, id) {
    // delete the doc
    localStorage.removeItem(id);

    // update the collection array
    const collectionString = localStorage.getItem(collection) ?? "[]";
    let collectionIDs = JSON.parse(collectionString);
    arrayRemove(collectionIDs, id);
    localStorage.setItem(collection, JSON.stringify(collectionIDs));
}

function arrayRemove(arr, value) {
    const index = arr.indexOf(value);
    arr.splice(index, 1);
    return arr;
  }

export async function query(collection, ...conditions) {
    const collectionString = localStorage.getItem(collection) ?? "[]";
    let collectionIDs = JSON.parse(collectionString);

    return (await Promise.all(collectionIDs
    .map(docID => getDoc(docID))))
    .filter(doc => {
        for (const condition of conditions) {
            if (!condition(doc)) return false;
        }
        return true;
    })
}

export function where(field, operator, value) {
    const keys = field.split('.');
    switch (operator) {
        case '==':
            return (doc) => {
                let current = doc.data;
                for (const key of keys) {
                    current = current?.[key];
                }
                return current == value;
            }
        case '!=':
            return (doc) => {
                let current = doc.data;
                for (const key of keys) {
                    current = current?.[key];
                }
                return current != value;
            }
        case '<':
            return (doc) => {
                let current = doc.data;
                for (const key of keys) {
                    current = current?.[key];
                }
                return current < value;
            }
        case '>':
            return (doc) => {
                let current = doc.data;
                for (const key of keys) {
                    current = current?.[key];
                }
                return current > value;
            }
        case '<=':
            return (doc) => {
                let current = doc.data;
                for (const key of keys) {
                    current = current?.[key];
                }
                return current <= value;
            }
        case '>=':
            return (doc) => {
                let current = doc.data;
                for (const key of keys) {
                    current = current?.[key];
                }
                return current >= value;
            }
    }
}