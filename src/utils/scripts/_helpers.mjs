export function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}

export function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

export async function getCurrentLocation(enableHighAccuracy = false, timeout = Infinity, maximumAge = 0) {
    return new Promise((resolve, reject) => {
        const options = {
            enableHighAccuracy,
            timeout,
            maximumAge
        }
        navigator.geolocation.getCurrentPosition((pos) => resolve(pos), (err) => reject({}), options);
    })
}

export function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
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
