import { saveDoc } from "./_database.mjs";
import { getRandomIndex } from "./_helpers.mjs";

export default class Message {
    constructor(socket, place, content, user, isSame, isOwner = true, isPublic = false, createdAt = null, _id = null) {
        this.place = place;                                     // place id
        this.content = content;                                 // text content of the message
        this.author = user;                                     // user object of the author of the message { id, name }
        this.isSame = isSame;                                   // whether or not this message is preceeded by another message of the same author
        this.isOwner = isOwner;                                 // whether or not the chat user is the message owner
        this.isPublic = isPublic;                               // whether or not the message is public
        this.createdAt = createdAt ?? new Date().getTime();     // when the message was created
        this._id = _id;                                         // uuid of the message
        this.socket = socket                                    // web socket
        this.element = null;                                    // html element of the message
        this.randomContent = randomizeText(this.content);       // randomized text content of the message

    }

    _toJSON() {
        return {
            place: this.place,
            content: this.content,
            author: this.author,
            isPublic: this.isPublic,
            createdAt: this.createdAt,
        }
    }

    // save this message to the database
    async save() {
        this._id = (await saveDoc('messages', this._id, this._toJSON()))._id;
        const socketMsg = {
            type: 'send',
            _id: this._id,
            ...this._toJSON()
        }
        this.socket.send(JSON.stringify(socketMsg));
    }

    update(data) {
        Object.assign(this, data);
    }
}

function randomizeText(text) {
    const conditions = [
        {
            regex: /[a-z]/g,
            pool: 'abcdefghijklmnopqrstuvwxyz'
        },
        {
            regex: /[A-Z]/g,
            pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        },
        {
            regex: /[0-9]/g,
            pool: '0123456789'
        },
        {
            regex: /[^\w\s]/g,
            pool: `!@#$%^&*()-_=+[{]}|;:'",<.>/?`
        },
    ]

    let replacement = '';
    for (let index = 0; index < text.length; index++) {
        let char = text.charAt(index);
        for (const condition of conditions) {
            if (condition.regex.test(char)) {
                char = condition.pool.charAt(getRandomIndex(condition.pool.length))
                break;
            }
        }

        replacement += char;
    }
    return replacement;
}