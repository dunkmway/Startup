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
    let eventID;
    
    if (QUERY_PARAMS.get('e')) {
        // edit
        eventID = QUERY_PARAMS.get('e');
        const data = await getEventFromDatabase(eventID);
        if (!data) {
            location.href = 'new-event.html'
            return;
        }

        // fill in the existing data
        fillInData(data);

        // show the delete button
        const deleteBtn = document.getElementById('delete');
        deleteBtn.style.display = 'block';
        deleteBtn.addEventListener('click', () =>  deleteEvent(data));

        // initialize the map with the existing bounds
        const bounds = new Bounds(data.bounds);
        map = new GoogleMap(document.getElementById('map'), bounds.center(), bounds);
        map.enableEdit();

    } else {
        // new
        eventID = self.crypto.randomUUID();

        // get the current location and initialize the map
        navigator.geolocation.getCurrentPosition(locationFound, locationNotFound, LOCATION_OPTIONS);
    }

    // set up the form submit action
    document.querySelector('form').addEventListener('submit', (ev) => submit(ev, eventID));
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

function deleteEvent(eventData) {
    deleteEventFromDatabase(eventData);
    location.href = `profile.html`
}

async function submit(event, eventID) {
    event.preventDefault();
    const target = event.target;
    const formData = new FormData(target);

    const data = {
        id: eventID,
        name: formData.get('name'),
        description: formData.get('description'),
        start: formData.get('start'),
        end: formData.get('end'),
        bounds: map.getBounds(),
        creator: getCurrentUser()
    }

    if (
        !data.name ||
        !data.description ||
        !data.start ||
        !data.end ||
        !data.bounds
    ) {
        alert('Please fill out all fields.')
        return;
    }

    await saveEventToDatabase(data);
    location.href = `profile.html`
}

async function getEventFromDatabase(eventID) {
    const dataString = localStorage.getItem(eventID);
    if (!dataString) return null;
    return JSON.parse(dataString);
}

async function saveEventToDatabase(data) {
    // save the event
    localStorage.setItem(data.id, JSON.stringify(data));

    // update the events association
    const eventIDsString = localStorage.getItem('events') ?? "[]";
    let eventIDs = JSON.parse(eventIDsString);
    if (!eventIDs.includes(data.id)) {
        eventIDs.push(data.id);
    }
    localStorage.setItem('events', JSON.stringify(eventIDs));

    // update the user_events association
    const usersIDsString = localStorage.getItem(`${data.creator.id}_events`) ?? "[]";
    let user_eventIDs = JSON.parse(usersIDsString);
    if (!user_eventIDs.includes(data.id)) {
        user_eventIDs.push(data.id);
    }
    localStorage.setItem(`${data.creator.id}_events`, JSON.stringify(user_eventIDs));
}

async function deleteEventFromDatabase(data) {
    // delete the event
    localStorage.removeItem(data.id);

    // update the events association
    const eventIDsString = localStorage.getItem('events') ?? "[]";
    let eventIDs = JSON.parse(eventIDsString);
    arrayRemove(eventIDs, data.id);
    localStorage.setItem('events', JSON.stringify(eventIDs));

    // update the user_events association
    const usersIDsString = localStorage.getItem(`${data.creator.id}_events`) ?? "[]";
    let user_eventIDs = JSON.parse(usersIDsString);
    arrayRemove(user_eventIDs, data.id);
    localStorage.setItem(`${data.creator.id}_events`, JSON.stringify(user_eventIDs));
}

initialize();