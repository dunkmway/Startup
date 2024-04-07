import Chat from './_Chat.mjs';
import { getRandomIndex } from './_helpers.mjs';
import { getCurrentUser } from './_auth.mjs';
import Place from './_Place.mjs';
import { Bounds } from './_maps.mjs';
import { GoogleMap } from './_maps.mjs';
import { getDoc } from './_database.mjs';

const MIN_RANDOM_MILLIS = 5000;
const MAX_RANDOM_MILLIS = 15000;

const QUERY_PARAMS = (new URL(document.location)).searchParams;
const PLACE_ID = QUERY_PARAMS.get('e');
const LOCATION_OPTIONS = {
    enableHighAccuracy: true
};

const CURRENT_USER = await getCurrentUser();
const chatContainer = document.getElementById('chat');

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

initialize();

async function initialize() {
    // load the place
    const placeDoc = await getDoc('places', PLACE_ID);
    if (!placeDoc) {
        window.location.replace('index.html');
        return;
    }
    const place = new Place(placeDoc);

    const chat = new Chat(
        PLACE_ID,
        CURRENT_USER,
        chatContainer,
        socket
    );
    await chat.loadMessages();
    chat.makePublic();
    document.getElementById('user-input').addEventListener('submit', (ev) => messageSubmit(ev, chat));

    // get the current location
    checkForLocation(place, chat);

    // set the title
    document.getElementById('placeName').textContent = place.name;

    // set the details
    const mapWrapper = document.getElementById('map');
    const bounds = new Bounds(place.bounds);
    new GoogleMap(mapWrapper, bounds.center(), bounds).enableMovement();
    document.querySelector('#placeDetails .description > p').textContent = place.description;
}

function checkForLocation(place, chat) {
    navigator.geolocation.getCurrentPosition((pos) => locationFound(pos, place, chat), (err) => locationNotFound(err, chat), LOCATION_OPTIONS);
    setTimeout(() => checkForLocation(place, chat), 10000);
}

function locationFound(pos, place, chat) {
    const bounds = new Bounds(place.bounds);
    // if the current position is within the bounds
    if (bounds.contains(pos.coords.latitude, pos.coords.longitude) && CURRENT_USER) {
        // within bounds
        chat.makePrivate();
        document.querySelector('#user-input > textarea').disabled = false;
    } else {
        chat.makePublic();
        document.querySelector('#user-input > textarea').disabled = true;
    }

    // show the bearing and distance
    const distance = bounds.distanceFrom(pos.coords.latitude, pos.coords.longitude);
    const angle = bounds.angleFrom(pos.coords.latitude, pos.coords.longitude);
    const direction = bounds.directionFromDegree(angle);

    if (distance != 0) {
        document.getElementById('distance').textContent = `${Math.round(distance * 100) / 100} mi`;
        document.getElementById('direction').textContent = direction;
        document.getElementById('compass').style.setProperty('--rotation', `${-angle}deg`);
    } else {
        document.getElementById('distance').textContent = '0 mi';
        document.getElementById('direction').textContent = 'You are here!';
        document.getElementById('compass').style.setProperty('--rotation', `${-90}deg`);
    }
}

function locationNotFound(err, chat) {
    chat.makePublic();
    document.querySelector('#user-input > textarea').disabled = true;
}

document.getElementById('message-input').addEventListener('keypress', (ev) => {
    if (ev.ctrlKey && ev.key == 'Enter') {
        document.getElementById('user-input').dispatchEvent(new Event('submit', { cancelable:true }));
    }
})

function messageSubmit(event, chat) {
    event.preventDefault();
    const target = event.target;

    if (chat.isPublic) return;

    const data = new FormData(target);
    chat.addMessage(data.get('message'));

    target.reset();
}
