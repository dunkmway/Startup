import "./_auth.mjs";
import { getManyFromDatabase } from "./_helpers.mjs";

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
                const foundUser = await getUserFromUsername(username);
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
    const id = self.crypto.randomUUID();
    const data = {
        username,
        password
    }
    // save the new user
    localStorage.setItem(id, JSON.stringify(data));
    // update the users array
    const usersString = localStorage.getItem(`users`) ?? "[]";
    let userIDs = JSON.parse(usersString);
    if (!userIDs.includes(id)) {
        userIDs.push(id);
    }
    localStorage.setItem(`users`, JSON.stringify(userIDs));

    // set the currentUser
    localStorage.setItem('user', JSON.stringify({
        id,
        username
    }))
    location.replace('profile.html');

    return true;
}

async function login(username, password) {
    const user = await getUserFromUsername(username);
    if (user && user.password == password) {
        // set the currentUser
        localStorage.setItem('user', JSON.stringify({
            id: user.id,
            username
        }))
        location.replace('profile.html');
        return true;
    } else {
        return false;
    }
}

// TESTING: super unsecure
async function getUserFromUsername(username) {
    const users = await getManyFromDatabase('user');
    return users.find(user => user.username == username);
}