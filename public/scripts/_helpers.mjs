export function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}

export function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
}