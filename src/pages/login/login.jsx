import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import "./login.css"

import { loginUser, createUser } from "../../utils/scripts/_auth.mjs";
import { query, where } from "../../utils/scripts/_database.mjs";

const INITIAL = 0;
const CREATE = 1;
const LOGIN = 2;

export function Login({ setUser }) {
    const [formState, setFormState] = useState(INITIAL);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const buttonMsg = (
        formState == LOGIN ? 'Log In' : 
        formState == CREATE ? 'Sign Up' :
        'Continue'
    )
    
    async function handleFormSubmit(event) {
        // start working
        event.preventDefault();
        setIsLoading(true);
        setError('');

        switch (formState) {
            case INITIAL:
                if (username.trim() != '') {
                    // we have the user name so check if a user exists with that name
                    const userDocs = await query('users', where('username', '$eq', username.trim()))
                    const foundUser = userDocs.length == 1 && userDocs[0];
                    if (foundUser) {
                        // continue to login
                        setFormState(LOGIN);
    
                    } else {
                        // continue to create
                        setFormState(CREATE);
                    }
                } else {
                    // show an error
                    setError('Please fill in username to continue.');
                }
                break;
            case CREATE:
                if (password.trim() != '') {
                    if (!(await signup(username.trim(), password))) {
                        setError('Error creating user.');
                    }
                } else {
                    // show an error
                    setError('Please fill in password to sign up.');
                }
                break;
            case LOGIN:
                if (password.trim() != '') {
                    if (!(await login(username.trim(), password))) {
                        setError('Incorrect password');
                    }
                } else {
                    // show an error
                    setError('Please fill in password to log in.');
                }
                break;
        }

        setIsLoading(false);
    }

    async function signup(username, password) {
        const createdUser = await createUser(username, password);
    
        if (createdUser) {
            setUser(createdUser);
            return true
        } else {
            return false
        }
    }
    
    async function login(username, password) {
        const existingUser = await loginUser(username, password);
    
        if (existingUser) {
            setUser(existingUser);
            return true
        } else {
            return false
        }
    }

    return (
        <main className="login">
            <NavLink to="/" className="logo">
                <img src="./images/Logo.png"></img>
                <h1>There</h1>
            </NavLink>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group" id="usernameGroup">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        autoFocus
                        autoComplete="off"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        readOnly={formState != INITIAL}
                    />
                </div>
                {
                    formState != INITIAL &&
                    <div className="form-group" id="passwordGroup">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoFocus
                            autoComplete="off"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                }
                <button type="submit" className={isLoading ? 'loading' : null}>{buttonMsg}</button>
                <p id="error">{error}</p>
            </form>
        </main>
    );
}