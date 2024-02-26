import { getCurrentUser } from "./_auth.mjs";
import { GoogleMap, Bounds } from "./_maps.mjs"
import { arrayRemove } from "./_helpers.mjs";

const LOCATION_OPTIONS = {
    timeout: 5000,
    maximumAge: 0,
};
const QUERY_PARAMS = (new URL(document.location)).searchParams;

let map;

async function initialize() {
    let placeID;
    
    if (QUERY_PARAMS.get('e')) {
        // edit
        placeID = QUERY_PARAMS.get('e');
        const data = await getPlaceFromDatabase(placeID);
        if (!data) {
            location.href = 'new-place.html'
            return;
        }

        // fill in the existing data
        fillInData(data);

        // show the delete button
        const deleteBtn = document.getElementById('delete');
        deleteBtn.style.display = 'block';
        deleteBtn.addEventListener('click', () =>  deletePlace(data));

        // initialize the map with the existing bounds
        const bounds = new Bounds(data.bounds);
        map = new GoogleMap(document.getElementById('map'), bounds.center(), bounds);
        map.enableEdit();

    } else {
        // new
        placeID = self.crypto.randomUUID();

        // get the current location and initialize the map
        navigator.geolocation.getCurrentPosition(locationFound, locationNotFound, LOCATION_OPTIONS);
    }

    // set up the form submit action
    document.querySelector('form').addEventListener('submit', (ev) => submit(ev, placeID));
}

function fillInData(data) {
    document.querySelectorAll('form input, form textarea').forEach(input => {
        input.value = data[input.name] ?? '';
    });
}
  
function locationFound(pos) {
    map = new GoogleMap(document.getElementById('map'), {
        lng: pos.coords.longitude,
        lat: pos.coords.latitude
    });
    map.enableEdit();
}
  
function locationNotFound(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    map = new GoogleMap(document.getElementById('map'));
    map.enableEdit();
}

function deletePlace(placeData) {
    deletePlaceFromDatabase(placeData);
    location.href = `profile.html`
}

async function submit(event, placeID) {
    event.preventDefault();
    const target = event.target;
    const formData = new FormData(target);

    const data = {
        id: placeID,
        name: formData.get('name'),
        description: formData.get('description'),
        bounds: map.getBounds(),
        creator: getCurrentUser()
    }

    if (
        !data.name ||
        !data.description ||
        !data.bounds
    ) {
        alert('Please fill out all fields.')
        return;
    }

    await savePlaceToDatabase(data);
    location.href = `profile.html`
}

async function getPlaceFromDatabase(placeID) {
    const dataString = localStorage.getItem(placeID);
    if (!dataString) return null;
    return JSON.parse(dataString);
}

async function savePlaceToDatabase(data) {
    // save the place
    localStorage.setItem(data.id, JSON.stringify(data));

    // update the places association
    const palceIDsString = localStorage.getItem('places') ?? "[]";
    let placeIDs = JSON.parse(palceIDsString);
    if (!placeIDs.includes(data.id)) {
        placeIDs.push(data.id);
    }
    localStorage.setItem('places', JSON.stringify(placeIDs));

    // update the user_places association
    const usersIDsString = localStorage.getItem(`${data.creator.id}_places`) ?? "[]";
    let user_placeIDs = JSON.parse(usersIDsString);
    if (!user_placeIDs.includes(data.id)) {
        user_placeIDs.push(data.id);
    }
    localStorage.setItem(`${data.creator.id}_places`, JSON.stringify(user_placeIDs));
}

async function deletePlaceFromDatabase(data) {
    // delete the place
    localStorage.removeItem(data.id);

    // update the places association
    const placeIDsString = localStorage.getItem('places') ?? "[]";
    let placeIDs = JSON.parse(placeIDsString);
    arrayRemove(placeIDs, data.id);
    localStorage.setItem('places', JSON.stringify(placeIDs));

    // update the user_places association
    const usersIDsString = localStorage.getItem(`${data.creator.id}_places`) ?? "[]";
    let user_placeIDs = JSON.parse(usersIDsString);
    arrayRemove(user_placeIDs, data.id);
    localStorage.setItem(`${data.creator.id}_places`, JSON.stringify(user_placeIDs));
}

initialize();