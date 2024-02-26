export function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}

export function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
}

export function restartJavascriptDeliverable() {
  const confirmation = confirm('Are you sure you want to restart the entire Javascript Deliverable? This will delete the entire testing database.')
  if (confirmation) {
    localStorage.clear();
    window.location.replace('index.html');
  }
}