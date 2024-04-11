import React, { useState } from "react";

export function Message({ _message, isPublicChat }) {
    const [message, setMessage] = useState(_message);

    function handleToggle() {
        message.isPublic = !message.isPublic
        message.save();
        setMessage(message);
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
                    <img src="./src/images/visible.png"/>:
                    <img src="./src/images/invisible.png"/>
                }
                </div>
            }
        </div>
    )
}