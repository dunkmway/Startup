import Message from "./_Message.mjs";
import { where, query } from "./_database.mjs";

export default class Chat {
    constructor(place, user, setMessages, isPublic = true) {
        this.place = place;
        this.user = user;
        this.isPublic = isPublic;
        this.messages = [];
        this.setMessages = setMessages;

        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.isConnected = false;
        this._setupSocket();
    }

    _setupSocket() {
        // Display that we have opened the webSocket
        this.socket.onopen = (event) => {
            this.isConnected = true;

            // send the connection message to this chat's place
            const msg = {
                type: 'listen',
                place: this.place
            }
            this.socket.send(JSON.stringify(msg));
        };

        // Display messages we receive from our friends
        this.socket.onmessage = async (event) => {
            this.getMessage(JSON.parse(event.data));
        };

        // If the webSocket is closed then disable the interface
        this.socket.onclose = (event) => {
            this.isConnected = false;
        };
    }

    getMessage(data) {
        const existingMessage = this.messages.find(message => message._id === data._id);
        if (existingMessage) {
            existingMessage.update(data);
            this.setMessages([...this.messages]);
        } else {
            const newMessage = new Message(
                this.socket,
                data.place,
                data.content,
                data.author,
                this._isMessageSame(data.author),
                this.user?._id === data.author._id,
                data.isPublic,
                data.createdAt,
                data._id
            );
    
            // store the message to the chat
            this.messages.push(newMessage);
            // render the message
            this.setMessages([...this.messages]);
        }
    }

    // used to add a message from the current user
    addMessage(content) {
        if (!this.user) return;
        if (!content.trim()) return;

        // construct the message with all defaults
        const newMessage = new Message(
            this.socket,
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
        this.setMessages([...this.messages]);

        return newMessage;
    }

    async loadMessages() {
        // get all of the messages for this place in the database
        const messageDocs = await query('messages', where('place', '$eq', this.place));

        // convert the database data to message objects
        let lastAuthor;
        return this.messages = messageDocs
        .map(doc => {
            const newMessage = new Message(
                this.socket,
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