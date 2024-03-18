const db = require('./mongodb.js');

const CREATE = 0;
const READ = 1;
const UPDATE = 2;
const DELETE = 3;

const RULES = {
    places: [
        {
            match: '.*',
            action: [CREATE],
            rule: async (context) => {
                return await context.user.exists() &&
                (await context.new.data())?.creator?.id === context.user.id
            }
        },
        {
            match: '.*',
            action: [READ],
            rule: async (context) => true
        },
        {
            match: '.*',
            action: [UPDATE, DELETE],
            rule: async (context) => {
                return await context.user.exists() &&
                (await context.new.data())?.creator?.id === context.user.id &&
                (await context.old.data())?.creator?.id === context.user.id
            }
        }
    ],
    users: [
        {
            match: '.*',
            action: [CREATE, READ],
            rule: async (context) => true
        },
        {
            match: '.*',
            action: [UPDATE, DELETE],
            rule: async (context) => {
                return await context.user.exists() &&
                context.user.id === context.new.id
            }
        },
    ],
    messages: [
        {
            match: '.*',
            action: [CREATE],
            rule: async (context) => {
                return true
                // return await context.user.exists() &&
                // (await context.new.data())?.author?.id === context.user.id
            }
        },
        {
            match: '.*',
            action: [READ],
            rule: async (context) => true
        },
        {
            match: '.*',
            action: [UPDATE, DELETE],
            rule: async (context) => {
                return await context.user.exists() &&
                (await context.new.data())?.author?.id === context.user.id &&
                (await context.old.data())?.author?.id === context.user.id
            }
        }
    ]
}

/**
 * Check if the given database operation is valid on this document for this user.
 * Update the RULES object to create custom access rules.
 * @param {Number} action type of CRUD operation (CREATE, READ, UPDATE, DELETE)
 * @param {String} collectionId id of collection that is being accessed
 * @param {String} docId id of document that is being accessed
 * @param {String} userId id of the user accessing the database
 * @param {Object} incomingData data that is to be saved to the document (CREATE and UPDATE only)
 * @returns {Promise<Boolean>} is the operation authorized
 */
async function check(action, collectionId, docId, userId, incomingData = null) {
    docId = docId ? docId.toString() : '';

    // get the rules for the collection
    const collectionRules = RULES[collectionId];
    if (!collectionRules) return false;

    // loop through the rules and find the request match
    for (let i = 0; i < collectionRules.length; i++) {
        const current = collectionRules[i];
        const match = new RegExp(current.match);
        // match the docId with Regex and action
        if (docId.match(match) && current.action.includes(action)) {
            const context = {
                old: {
                    id: docId,
                    data: async () => await db.collection(collectionId).findOne({ _id: docId})
                },
                user: {
                    id: userId,
                    exists: async () => (await db.collection('users').findOne({ _id: userId})) != null
                },
                new: {
                    id: docId,
                    data: async () => incomingData
                }
            }
            return await current.rule(context);
        }
    }

    // if no rules apply
    return false;
}

module.exports = {
    CREATE,
    READ,
    UPDATE,
    DELETE,
    check
};