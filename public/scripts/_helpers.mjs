export function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}

export function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
}

export function arrayRemove(arr, value) {
  const index = arr.indexOf(value);
  arr.splice(index, 1);
  return arr;
}

export function restartJavascriptDeliverable() {
  localStorage.clear();
  window.location.replace('index.html');
}

export async function getManyToOneDataFromDatabase(manyName, oneID) {
  const manyIDsString = localStorage.getItem(`${oneID}_${manyName}s`) ?? "[]";
  const manyIDs = JSON.parse(manyIDsString);
  return manyIDs.map(id => {
    const data = JSON.parse(localStorage.getItem(id))
    data.id = id;
    return data;
  })
}

export async function getManyFromDatabase(manyName) {
  const manyIDsString = localStorage.getItem(`${manyName}s`) ?? "[]";
  const manyIDs = JSON.parse(manyIDsString);
  return manyIDs.map(id => {
    const data = JSON.parse(localStorage.getItem(id))
    data.id = id;
    return data;
  })
}