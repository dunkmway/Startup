import React from "react";
import { NavLink } from 'react-router-dom';

import { signOutUser } from "../../utils/scripts/_auth.mjs";

export function Header({user, setUser}) {

    async function handleSignout() {
        await signOutUser();
        setUser({});
    }

    return (
        <header>
            <NavLink to="/" className="logo">
                <img src="./src/images/Logo.png"></img>
                <h1>There</h1>
            </NavLink>
            <nav>
                <menu>
                    {(user == null || user._id == null) && (
                        <li>
                            <NavLink to='/login'>Login</NavLink>
                        </li>
                    )}
                    {user?._id != null && (
                        <>
                            <li>
                                <NavLink to='/profile'>{user.username}</NavLink>
                            </li>
                            <li onClick={handleSignout}>Sign Out</li>
                        </>
                    )}
                </menu>
            </nav>
        </header>
    )
}