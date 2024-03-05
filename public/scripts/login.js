import "./_auth.mjs";
import { setCurrentUser } from "./_auth.mjs";
import { query, saveDoc, where } from "./_database.mjs";

const INITIAL = 0;
const CREATE = 1;
const LOGIN = 2;
let CURRENT_STATE = INITIAL;

document.querySelector('form').addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
    event.preventDefault();
    const target = event.target;
    const data = new FormData(target);
    const username = data.get('username').trim().toLowerCase();
    const password = data.get('password').trim().toLowerCase();

    resetError();
    switch (CURRENT_STATE) {
        case INITIAL:
            if (username) {
                // we have the user name so check if a user exists with that name
                const userDocs = await query('users', where('username', '==', username))
                const foundUser = userDocs.length == 1 && userDocs[0];
                if (foundUser) {
                    // continue to login
                    setLogin();

                } else {
                    // continue to create
                    setCreate();
                }
            } else {
                // show an error
                handleError('Please fill in username to continue.');
            }
            break;
        case CREATE:
            if (password) {
                if (!(await signup(username, password))) {
                    handleError('Error creating user.');
                }
            } else {
                // show an error
                handleError('Please fill in password to sign up.');
            }
            break;
        case LOGIN:
            if (password) {
                if (!(await login(username, password))) {
                    handleError('Incorrect password');
                }
            } else {
                // show an error
                handleError('Please fill in password to log in.');
            }
            break;
    }
}

function setLogin() {
    // change the button text
    const btn = document.querySelector('button[type="submit"]');
    btn.textContent = 'Log In'

    // show the password
    document.getElementById('passwordGroup').style.display = 'block';
    document.getElementById('password').focus();

    // disable the username
    document.getElementById('username').readOnly = true;

    CURRENT_STATE = LOGIN;
}

function setCreate() {
    // change the button text
    const btn = document.querySelector('button[type="submit"]');
    btn.textContent = 'Sign Up'

    // show the password
    document.getElementById('passwordGroup').style.display = 'block';
    document.getElementById('password').focus();

    // disable the username
    document.getElementById('username').readOnly = true;

    CURRENT_STATE = CREATE;
}

function resetError() {
    const error = document.getElementById('error');
    error.style.display = 'none';
    error.textContent = '';
}

function handleError(errorMsg) {
    const error = document.getElementById('error');
    error.textContent = errorMsg;
    error.style.display = 'block';
}

async function signup(username, password) {
    const data = {
        username,
        password
    }
    // save the new user
    await saveDoc('users', null, data);

    // set the currentUser
    setCurrentUser(id);
    location.replace('profile.html');

    return true;
}

async function login(username, password) {
    const userDocs = await query('users',
        where('username', '==', username),
        where('password', '==', password)
    )

    if (userDocs.length == 1) {
        await setCurrentUser(userDocs[0].id);
        location.replace('profile.html');
        return true
    } else {
        return false
    }
}