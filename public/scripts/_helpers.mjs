export function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}

export function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
}

export async function httpRequest(URL, options = {}) {
  try {
    const response = await fetch(URL, options);
    if (response.ok) {
      return await response.json();
    } else {
      console.warn({
        code: response.status,
        message: response.statusText
      })
      return null;
    }
  } catch (e) {
    console.warn(e);
    return null;
  }
}
