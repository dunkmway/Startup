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

export async function getManyToOneDataFromDatabase(manyName, oneID) {
  // get the message IDs for this event from localStorage
  const manyIDsString = localStorage.getItem(`${oneID}_${manyName}s`) ?? "[]";
  const manyIDs = JSON.parse(manyIDsString);
  // return the data in localStorage for each message
  return manyIDs.map(id => JSON.parse(localStorage.getItem(id)))
}