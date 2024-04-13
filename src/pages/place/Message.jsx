import React, { useState } from "react";

export function Message({ _message, isPublicChat }) {
    const [message, setMessage] = useState(_message);

    function handleToggle() {
        message.isPublic = !message.isPublic
        message.save();
        // clone the object so that React detects a chnage and will force the refresh
        // it needs to be this gross since we need to copy the object including its methods
        let clone = Object.assign(Object.create(Object.getPrototypeOf(message)), message)
        setMessage(clone);
    }

    const isHidden = !message.isOwner && isPublicChat && !message.isPublic;
    return (
        <div className={`message-bubble ${message.isOwner ? 'right' : 'left'} ${isHidden && 'hidden'} ${message.isSame && 'same'}`}>
            <p className="author">{message.author.username}</p>
            <pre className="message">{isHidden ? message.randomContent : message.content}</pre>
            {
                message.isOwner &&
                <div className="toggle" onClick={handleToggle}>
                {
                    message.isPublic ?
                    <img src="./images/visible.png"/> :
                    <img src="./images/invisible.png"/>
                }
                </div>
            }
        </div>
    )
}