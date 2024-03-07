const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const security = require('./security.js');

global.db = {};

// get the whole database for testing purposes
router.get('/database', (req, res) => {
    res.status(200).send(global.db);
});

// restart the database for testing purposes
router.get('/database/restart', (req, res) => {
    global.db = {};
    res.sendStatus(200);
});

// query database
router.get('/database/:collection/:doc?', async (req, res) => {
    const { collection, doc } = req.params;
    const user = req.headers['user'];

    if (doc) {
        if (global.db[collection]?.[doc] == null) {
            res.send({
                id: doc,
                collection,
                data: null
            });
        } else {
            const singleCheck = await security.check(security.READ, collection, doc, user);
            if (!singleCheck) {
                res.sendStatus(403);
                return;
            }
            res.status(200).send(global.db[collection][doc]);
        }
    } else {
        const queries = Object.keys(req.query)
        .map(key => {
            return where(
                key,
                req.query[key].split('_')[0],
                req.query[key].split('_')[1]
            )
        });
        const result = await query(collection, user, ...queries);
        res.send(result);
    }
});

// save doc
router.post('/database/:collection/:doc?', async (req, res) => {
    let { collection, doc } = req.params;
    const user = req.headers['user'];
    
    const check = await security.check(
        global.db[collection]?.[doc] ? security.UPDATE : security.CREATE,
        collection,
        doc,
        user,
        req.body
    );
    if (!check) {
        res.sendStatus(403);
        return;
    }

    if (global.db[collection] == null) {
        global.db[collection] = {};
    }

    if (!doc) {
        doc = crypto.randomUUID();
    }

    const entry = {
        id: doc,
        collection,
        data: req.body
    }

    global.db[collection][doc] = entry;

    res.send(entry);
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

    delete global.db[collection][doc];
    res.send({
        id: doc,
        collection
    });
});

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