import { getCurrentUser } from "./_auth.mjs";
import { GoogleMap, Bounds } from "./_maps.mjs"
import { deleteDoc, getDoc, saveDoc } from "./_database.mjs";

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
        const placeDoc = await getDoc('places', placeID);
        const data = placeDoc.data;
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
        placeID = null;

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

async function deletePlace(placeID) {
    await deleteDoc('places', placeID);
    location.href = `profile.html`;
}

async function submit(event, placeID) {
    event.preventDefault();
    const target = event.target;
    const formData = new FormData(target);

    const data = {
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

    await saveDoc('places', placeID, data);
    location.href = `profile.html`
}

initialize();