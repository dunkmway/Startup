import React from "react";

export function NotFound() {
    return (
        <main style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <h1 style={{fontSize:'6rem', marginBottom: '1rem'}}>404</h1>
            <h2 style={{maxWidth:'400px'}}>You're drunk! Go back home.</h2>
        </main>
    )
}