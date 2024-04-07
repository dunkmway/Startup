import React from "react";
// import "./login.css"

export function Login() {
    return (
        <>
            <a href="index.html" class="logo">
                <img src="images/Logo.png"></img>
                <h1>There</h1>
            </a>
            <form>
                <div class="form-group" id="usernameGroup">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" autofocus autocomplete="off"></input>
                </div>
                <div class="form-group" id="passwordGroup">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password"></input>
                </div>
                <button type="submit">Continue</button>
                <p id="error"></p>
            </form>
        </>
    );
}