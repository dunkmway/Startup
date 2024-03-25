const express = require('express');
const router = express.Router();
const security = require('./security.js');
const { ObjectId } = require('mongodb');
const db = require('./mongodb.js');

// query database
router.get('/database/:collection/:doc?', async (req, res) => {
    const { collection, doc } = req.params;
    const userToken = req.cookies['token'];

    if (doc) {
        const check = await security.check(security.READ, collection, doc, userToken);
        if (!check) {
            res.sendStatus(403);
            return;
        }
        const result = await readDoc(collection, doc);
        res.status(200).send(result);
    } else {
        const filter = Object.keys(req.query)
        .reduce((prev, curr) => {
            const split = curr.split('|')
            const field = split[0];
            const operator = split[1];
            const value = JSON.parse(req.query[curr]);

            if (!prev[field]) prev[field] = {};
            prev[field][operator] = value;
            return prev;
        }, {})

        const cursor = db.collection(collection).find(filter);
        const result = (await cursor.toArray())
        .filter(async data => await security.check(security.READ, collection, data._id, userToken))
        res.send(result);
    }
});

// save doc
router.post('/database/:collection/:doc?', async (req, res) => {
    let { collection, doc } = req.params;
    const userToken = req.cookies['token'];

    const docData = await readDoc(collection, doc);
    
    const check = await security.check(
        docData ? security.UPDATE : security.CREATE,
        collection,
        doc,
        userToken,
        req.body
    );
    if (!check) {
        res.sendStatus(403);
        return;
    }

    // update
    if (docData) {
        const result = await updateDoc(collection, doc, req.body);
        res.send( {_id: result.upsertedId ?? doc} );
    }
    // create
    else {
        const result = await createDoc(collection, doc, req.body);
        res.send( { _id: result.insertedId ?? doc} );
    }
});

// delete doc
router.delete('/database/:collection/:doc', async (req, res) => {
    const { collection, doc } = req.params;
    const userToken = req.cookies['token'];

    const check = await security.check(security.DELETE, collection, doc, userToken);
    if (!check) {
        res.sendStatus(403);
        return;
    }

    await deleteDoc(collection, doc);
    res.send( {_id: doc} );
});

async function createDoc(collection, doc, data) {
    if (!collection) return null;
    return await db.collection(collection).insertOne({ _id: new ObjectId(doc), ...data});
}

async function readDoc(collection, doc) {
    if (!collection || !doc) return null;
    return await db.collection(collection).findOne({ _id: new ObjectId(doc)});
}

async function updateDoc(collection, doc, data) {
    if (!collection || !doc) return null;
    return await db.collection(collection).replaceOne({ _id: new ObjectId(doc)}, data);
}

async function deleteDoc(collection, doc) {
    if (!collection || !doc) return null;
    return await db.collection(collection).deleteOne({ _id: new ObjectId(doc)});
}

module.exports = router;