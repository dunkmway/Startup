const express = require('express');
const router = express.Router();

let DATABASE = {};

// get the whole database for testing purposes
router.get('/database', (req, res) => {
    res.send(DATABASE);
});

// restart the database for testing purposes
router.get('/database/restart', (req, res) => {
    DATABASE = {};
    res.sendStatus(200);
});

// query database
router.get('/database/:collection/:doc?', (req, res) => {
    const { collection, doc } = req.params;
    if (!collection) {
        res.sendStatus(400).send('collection is required');
        return;
    }

    if (doc) {
        res.send(DATABASE[collection]?.[doc] ?? {});
    } else {
        const queries = Object.keys(req.query)
        .map(key => {
            return where(
                key,
                req.query[key].split('_')[0],
                req.query[key].split('_')[1]
            )
        });
        const result = query(DATABASE[collection] ?? {}, ...queries);
        res.send(result);
    }
});

// save doc
router.post('/database/:collection/:doc?', (req, res) => {
    let { collection, doc } = req.params;
    if (!collection) {
        res.sendStatus(400);
        return;
    }
    if (DATABASE[collection] == null) {
        DATABASE[collection] = {};
    }

    if (!doc) {
        doc = crypto.randomUUID();
    }

    const entry = {
        id: doc,
        collection,
        data: req.body
    }

    DATABASE[collection][doc] = entry;

    res.send(entry);
});

// delete doc
router.delete('/database/:collection/:doc', (req, res) => {
    const { collection, doc } = req.params;
    if (!collection) {
        res.sendStatus(400).send('collection is required');
        return;
    }
    if (!doc) {
        res.sendStatus(400).send('doc is required');
        return;
    }
    delete DATABASE[collection][doc];
    res.send({
        id: doc,
        collection
    });
});

function query(collectionDocs, ...conditions) {
    if (conditions.length == 0) {
        return collectionDocs;
    }
    const queryResult = {};

    for (const docID in collectionDocs) {
        const doc = collectionDocs[docID];
        for (const condition of conditions) {
            if (condition(doc)) {
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