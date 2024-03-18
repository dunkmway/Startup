const express = require('express');
const router = express.Router();
const security = require('./security.js');
const db = require('./mongodb.js');

// query database
router.get('/database/:collection/:doc?', async (req, res) => {
    const { collection, doc } = req.params;
    const user = req.headers['user'];

    if (doc) {
        const check = await security.check(security.READ, collection, doc, user);
        if (!check) {
            res.sendStatus(403);
            return;
        }
        const result = await readDoc(collection, doc);
        res.status(200).send(result);
    } else {
        const filter = Object.keys(req.query)
        .reduce((prev, curr) => {
            const field = curr;
            const split = req.query[field].split('_')
            const operator = split[0];
            const value = split[1];
            return prev = { ...prev, [field]: { [operator]: value }}
        }, {})

        const cursor = db.collection(collection).find(filter);
        const result = (await cursor.toArray())
        .filter(async data => await security.check(security.READ, collection, data._id, user))
        res.send(result);
    }
});

// save doc
router.post('/database/:collection/:doc?', async (req, res) => {
    let { collection, doc } = req.params;
    const user = req.headers['user'];

    const docData = await readDoc(collection, doc);
    
    const check = await security.check(
        docData ? security.UPDATE : security.CREATE,
        collection,
        doc,
        user,
        req.body
    );
    if (!check) {
        res.sendStatus(403);
        return;
    }

    // update
    if (docData) {
        const result = await updateDoc(collection, doc, req.body);
        res.send(result.upsertedId);
    }
    // create
    else {
        const result = await createDoc(collection, doc, req.body);
        res.send(result.insertedId);
    }
});

// delete doc
router.delete('/database/:collection/:doc', async (req, res) => {
    const { collection, doc } = req.params;
    const user = req.headers['user'];

    const check = await security.check(security.DELETE, collection, doc, user);
    if (!check) {
        res.sendStatus(403);
        return;
    }

    await deleteDoc(collection, doc);
    res.send(doc);
});

async function createDoc(collection, doc, data) {
    if (!collection) return null;
    return await db.collection(collection).insertOne({ _id: doc, ...data});
}

async function readDoc(collection, doc) {
    if (!collection || !doc) return null;
    return await db.collection(collection).findOne({ _id: doc});
}

async function updateDoc(collection, doc, data) {
    if (!collection || !doc) return null;
    return await db.collection(collection).replaceOne({ _id: doc}, data);
}

async function deleteDoc(collection, doc) {
    if (!collection || !doc) return null;
    return await db.collection(collection).deleteOne({ _id: doc});
}

async function query(collection, user, ...conditions) {
    const collectionDocs = global.db[collection] ?? {}
    const queryResult = {};

    for (const docID in collectionDocs) {
        const doc = collectionDocs[docID];
        if (await security.check(security.READ, collection, docID, user)) {
            if (conditions.length > 0) {
                for (const condition of conditions) {
                    if (condition(doc)) {
                        queryResult[docID] = doc;
                    }
                }
            } else {
                queryResult[docID] = doc;
            }
        }
    }
    return queryResult;
}

function where(field, operator, value) {
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

module.exports = router;