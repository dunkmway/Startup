export function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}

export function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
}

export function getCurrentUser() {
    const userString = localStorage.getItem('user');
    return userString && JSON.parse(userString);
}