import { getRandomIndex } from "./_helpers.mjs";

export default class Message {
    constructor(event, content, user, isSame, isOwner = true, isPublic = false, createdAt = null, id = null) {
        this.event = event;                                     // event id
        this.content = content;                                 // text content of the message
        this.author = user;                                     // user object of the author of the message { id, name }
        this.isSame = isSame;                                   // whether or not this message is preceeded by another message of the same author
        this.isOwner = isOwner;                                 // whether or not the chat user is the message owner
        this.isPublic = isPublic;                               // whether or not the message is public
        this.createdAt = createdAt ?? new Date().getTime();     // when the message was created
        this.id = id ?? self.crypto.randomUUID();               // uuid of the message
        this.element = null;                                    // html element of the message

    }

    async save() {
        // save this message to the database
        // for testing purposes we will save it to localstorage
        this._save_localStorage();
    }

    _save_localStorage() {
        // we don't want to save the element
        delete this.element;
        // save the message
        localStorage.setItem(this.id, JSON.stringify(this));

        // update the event_messages association
        const messageIDsString = localStorage.getItem(`${this.event}_messages`) ?? "[]";
        let messageIDs = JSON.parse(messageIDsString);
        messageIDs.push(this.id);
        localStorage.setItem(`${this.event}_messages`, JSON.stringify(messageIDs));
    }

    renderPublic(container) {
        this._render(container, true);
    }

    renderPrivate(container) {
        this._render(container, false)
    }

    _render(container, isPublicRendering) {
        // basic setup if first render
        if (this.element == null) {
            this.element = document.createElement('div');
            this.element.classList.add('message-bubble');
            container.appendChild(this.element);
        }

        // rerendering
        const author = document.createElement('p');
        author.className = 'author';
        author.textContent = this.author.name;
        this.element.appendChild(author);

        const isHidden = !this.isOwner && isPublicRendering && !this.isPublic;
        const message = document.createElement('pre');
        message.classList.add('message');
        message.textContent = isHidden ? randomizeText(this.content) : this.content;
        this.element.appendChild(message);
        
        this.element.classList.add(this.isOwner ? 'right' : 'left');
        isHidden && this.element.classList.add('hidden');
        this.isSame && this.element.classList.add('same');
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