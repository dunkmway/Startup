import React from "react";
import './layout.css';

import { Header } from "./header";
import { Footer } from "./footer";

export function Layout({ children, user, setUser }) {
    return (
        <>
            <Header user={user} setUser={setUser} />
            {children}
            <Footer />
        </>
    )
}