import Message from "./_Message.mjs";
import { where, query } from "./_database.mjs";
import { removeAllChildNodes } from "./_helpers.mjs";

export default class Chat {
    constructor(place, user, container, isPublic = true) {
        this.place = place;
        this.container = container;
        this.user = user;
        this.isPublic = isPublic;
    }

    // used to add a message from the current user
    addMessage(content) {
        if (!this.user) return;
        if (!content.trim()) return;

        // construct the message with all defaults
        const newMessage = new Message(
            this.place,
            content,
            this.user,
            this._isMessageSame(this.user)
        );
        // async save the message;
        newMessage.save();

        // store the message to the chat
        this.messages.push(newMessage);
        // render the message
        this.isPublic ? newMessage.renderPublic(this.container) : newMessage.renderPrivate(this.container);

        // scroll the message into view
        this._scrollToMessage(newMessage);

        return newMessage;
    }

    // used for testing to fake webhook data
    addFakeMessage(content, user) {
        // construct the message with defaults except set isOwner to false
        const newMessage = new Message(
            this.place,
            content,
            user,
            this._isMessageSame(user),
            false,
            Math.random() < 0.2
        );
        // async save the message;
        newMessage.save();

        // store the message to the chat
        this.messages.push(newMessage);
        // render the message
        this.isPublic ? newMessage.renderPublic(this.container) : newMessage.renderPrivate(this.container);

        return newMessage;
    }

    makePublic() {
        this.isPublic = true;
        this._render();
    }

    makePrivate() {
        this.isPublic = false;
        this._render();
    }

    _scrollToMessage(message) {
        message.element.scrollIntoView();
    }

    /**
     * 
     * @param {Boolean} rerender will remove all messages and rerender them.
     */
    _render(rerender = false) {
        if (rerender) {
            removeAllChildNodes(this.container);
        }
        this.messages.forEach(message => {
            this.isPublic ? message.renderPublic(this.container) : message.renderPrivate(this.container);
        });
    }

    async loadMessages() {
        // get all of the messages for this place in the database
        const messageDocs = await query('messages', where('place', '$eq', this.place));

        // convert the database data to message objects
        let lastAuthor;
        return this.messages = messageDocs
        .map(doc => {
            const newMessage = new Message(
                doc.place,
                doc.content,
                doc.author,
                lastAuthor?._id == doc.author._id,
                doc.author._id == this.user?._id,
                doc.isPublic, 
                doc.createdAt,
                doc._id
            );

            lastAuthor = doc.author;
            return newMessage;
        })
        .sort((a,b) => a.createdAt - b.createdAt)
    }

    // help to determine if the author for an upcoming message isSame
    _isMessageSame(author) {
        const lastMessage = this.messages[this.messages.length - 1]
        return author._id == lastMessage?.author?._id;
    }
}