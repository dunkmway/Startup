import { saveDoc } from "./_database.mjs";
import { getRandomIndex, removeAllChildNodes } from "./_helpers.mjs";

export default class Message {
    constructor(place, content, user, isSame, isOwner = true, isPublic = false, createdAt = null, _id = null) {
        this.place = place;                                     // place id
        this.content = content;                                 // text content of the message
        this.author = user;                                     // user object of the author of the message { id, name }
        this.isSame = isSame;                                   // whether or not this message is preceeded by another message of the same author
        this.isOwner = isOwner;                                 // whether or not the chat user is the message owner
        this.isPublic = isPublic;                               // whether or not the message is public
        this.createdAt = createdAt ?? new Date().getTime();     // when the message was created
        this._id = _id;                                         // uuid of the message
        this.element = null;                                    // html element of the message
        this.randomContent = randomizeText(this.content);       // randomized text content of the message

    }

    // save this message to the database
    async save() {
        // make a copy without the event or id to save
        const clone = {
            place: this.place,
            content: this.content,
            author: this.author,
            isPublic: this.isPublic,
            createdAt: this.createdAt,
        };
        await saveDoc('messages', this._id, clone);
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
        removeAllChildNodes(this.element);
        const author = document.createElement('p');
        author.className = 'author';
        author.textContent = this.author.username;
        this.element.appendChild(author);

        const isHidden = !this.isOwner && isPublicRendering && !this.isPublic;
        const message = document.createElement('pre');
        message.classList.add('message');
        message.textContent = isHidden ? this.randomContent : this.content;
        this.element.appendChild(message);
        
        this.element.classList.add(this.isOwner ? 'right' : 'left');
        if (this.isOwner) {
            // include the visibility toggle
            const toggle = document.createElement('div');
            toggle.className = 'toggle';
            toggle.innerHTML = `
            ${this.isPublic ?
                '<img src="images/visible.png">':
                '<img src="images/invisible.png">'
            }
            `
            toggle.addEventListener('click', () => {
                this.isPublic = !this.isPublic;
                this.save();
                this._render(container, isPublicRendering);
            })
            this.element.appendChild(toggle);
        }
        isHidden && this.element.classList.add('hidden');
        !isHidden && this.element.classList.remove('hidden');
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