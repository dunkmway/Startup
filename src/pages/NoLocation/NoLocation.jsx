import React, { useEffect } from "react";
import { getCurrentLocation } from "../../utils/scripts/_helpers.mjs";

export function NoLocation({ setLocation }) {

    useEffect(() => {
        getCurrentLocation(true)
        .then(position => setLocation(position))
        .catch(err => setLocation({}));
    })

    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                maxWidth: '400px',
                width: '100%',
                height: '0',
                paddingBottom: '25%',
                position: 'relative'  
            }}><iframe src="https://giphy.com/embed/3ohzdQ1IynzclJldUQ" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" className="giphy-embed"></iframe></div>
            <h1>
                Turn that location back on...
            </h1>
        </main>
    )
}