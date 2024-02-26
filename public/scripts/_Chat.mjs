import Message from "./_Message.mjs";
import { removeAllChildNodes } from "./_helpers.mjs";

export default class Chat {
    constructor(event, user, container, isPublic = true) {
        this.event = event;
        this.container = container;
        this.user = user;
        this.isPublic = isPublic;

        this.messages = this._getDatabaseMessages();

        this._render(true);
    }

    // used to add a message from the current user
    addMessage(content) {
        if (!this.user) return;
        if (!content.trim()) return;

        // construct the message with all defaults
        const newMessage = new Message(
            this.event,
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
            this.event,
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

    _getDatabaseMessages() {
        // get all of the messages for this event in the database
        // for testing we will use localStorage
        const messageData = this._getLocalStorage_Messages();

        // convert the database data to message objects
        let lastAuthor;
        return messageData.map(data => {
            const newMessage = new Message(
                data.event,
                data.content,
                data.author,
                lastAuthor?.id == data.author.id,
                data.author.id == this.user.id,
                data.isPublic, 
                data.createdAt,
                data.id
            );

            lastAuthor = data.author;
            return newMessage;
        })
    }

    _getLocalStorage_Messages() {
        // get the message IDs for this event from localStorage
        const messageIDsString = localStorage.getItem(`${this.event}_messages`) ?? "[]";
        const messageIDs = JSON.parse(messageIDsString);
        // return the data in localStorage for each message
        return messageIDs.map(id => JSON.parse(localStorage.getItem(id)))
    }

    // help to determine if the author for an upcoming message isSame
    _isMessageSame(author) {
        const lastMessage = this.messages[this.messages.length - 1]
        return author.id == lastMessage?.author?.id;
    }
}