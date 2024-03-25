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

// TESTING
const RANDOM_MESSAGE_COOLDOWN = 5;
let currentRandomMessageLevel = 1;
// TESTING

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

    // TESTING start running random messages
    // createRandomMessage(chat);
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

    // FOR TESTING:
    // reset the cooldown for random messages
    // currentRandomMessageLevel = 1;
    // createRandomMessage(chat);
}

// FOR TESTING:
// Will create random messages
function createRandomMessage(chat) {
    const randomMillis = Math.random() * (MAX_RANDOM_MILLIS - MIN_RANDOM_MILLIS) + MIN_RANDOM_MILLIS;
    setTimeout(async () => {
        // only allow a certain amount of fake messages between real messages
        if (currentRandomMessageLevel <= RANDOM_MESSAGE_COOLDOWN) {
            const message = await getRandomMessage();
            chat.addFakeMessage(
                message,
                randomUsers[getRandomIndex(randomUsers.length)]
            );
            currentRandomMessageLevel++;
            createRandomMessage(chat);
        }

    }, randomMillis)
}

function getRandomMessage() {
    return fetch("https://icanhazdadjoke.com", {
        headers: {
            "Accept": "application/json",
            "User-Agent": "BYU CS 260 - There (https://github.com/dunkmway/Startup)"
        }
    })
    .then(response => response.json())
    .then(data => data.joke);
}

const randomUsers = [
    {
        _id: "14a0cb61-e65b-4718-a4f6-684da4fac6c9",
        username:  "Wren Clements"
    },
    {
        _id: "e9ddd4ec-8f86-487d-8c43-97f90a93642d",
        username:  "Fisher Hart"
    },
    {
        _id: "218c0e09-4b31-4979-8c78-6d278c4c43bb" ,
        username:  "Gemma Schmidt"
    },
    {
        _id: "c6e363c1-a735-4e32-ad42-756c3de7878c",
        username:  "Zayden Alvarado"
    },
    {
        _id: "3db54d11-5319-45cd-87f7-ecc50bee5807",
        username:  "Blake Hickman"
    },
];