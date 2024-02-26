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

const CURRENT_USER = getCurrentUser();
const chatContainer = document.getElementById('chat');

initialize();

async function initialize() {
    // load the place
    const placeDoc = await getDoc(PLACE_ID);
    const place = new Place(placeDoc);

    const chat = new Chat(
        PLACE_ID,
        CURRENT_USER,
        chatContainer
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
    document.querySelector('#placeDetails > p').textContent = place.description;
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

    // TESTING start running random messages
    createRandomMessage(chat);
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
    currentRandomMessageLevel = 1;
    createRandomMessage(chat);
}

// FOR TESTING:
// Will create random messages
function createRandomMessage(chat) {
    const randomMillis = Math.random() * (MAX_RANDOM_MILLIS - MIN_RANDOM_MILLIS) + MIN_RANDOM_MILLIS;
    setTimeout(() => {
        // only allow a certain amount of fake messages between real messages
        if (currentRandomMessageLevel <= RANDOM_MESSAGE_COOLDOWN) {
            chat.addFakeMessage(
                randomMessages[getRandomIndex(randomMessages.length)],
                randomUsers[getRandomIndex(randomUsers.length)]
            );
            currentRandomMessageLevel++;
            createRandomMessage(chat);
        }

    }, randomMillis)
}

const randomMessages = [
    "The fact that there's a stairway to heaven and a highway to hell explains life well.",
    "The sudden rainstorm washed crocodiles into the ocean.",
    "The fish dreamed of escaping the fishbowl and into the toilet where he saw his friend go.",
    "One small action would change her life, but whether it would be for better or for worse was yet to be determined.",
    "The beach was crowded with snow leopards.",
    "It's never comforting to know that your fate depends on something as unpredictable as the popping of corn.",
    "I cheated while playing the darts tournament by using a longbow.",
    "After coating myself in vegetable oil I found my success rate skyrocketed.",
    "Despite what your teacher may have told you, there is a wrong way to wield a lasso.",
    "There were three sphered rocks congregating in a cubed room.",
    "He found the end of the rainbow and was surprised at what he found there.",
    "Flash photography is best used in full sunlight.",
    "The efficiency we have at removing trash has made creating trash more acceptable.",
    "His get rich quick scheme was to grow a cactus farm.",
    "She couldn't decide of the glass was half empty or half full so she drank it.",
    "Rock music approaches at high velocity.",
    "I've never seen a more beautiful brandy glass filled with wine.",
    "She had the gift of being able to paint songs.",
    "Everybody should read Chaucer to improve their everyday vocabulary.",
    "Everyone was busy, so I went to the movie alone.",
    "Andy loved to sleep on a bed of nails.",
    "Love is not like pizza.",
    "If you spin around three times, you'll start to feel melancholy.",
    "He wondered if it could be called a beach if there was no sand.",
    "The stranger officiates the meal.",
    "He realized there had been several deaths on this road, but his concern rose when he saw the exact number.",
    "He learned the important lesson that a picnic at the beach on a windy day is a bad idea.",
    "All you need to do is pick up the pen and begin.",
    "A song can make or ruin a person's day if they let it get to them.",
    "The river stole the gods.",
    "Lightning Paradise was the local hangout joint where the group usually ended up spending the night.",
    "While all her friends were positive that Mary had a sixth sense, she knew she actually had a seventh sense.",
    "Fluffy pink unicorns are a popular status symbol among macho men.",
    "Watching the geriatric men's softball team brought back memories of 3 yr olds playing t-ball.",
    "He had unknowingly taken up sleepwalking as a nighttime hobby.",
    "He uses onomatopoeia as a weapon of mental destruction.",
    "Don't step on the broken glass.",
    "Cats are good pets, for they are clean and are not noisy.",
    "Siri became confused when we reused to follow her directions.",
    "He colored deep space a soft yellow.",
    "They desperately needed another drummer since the current one only knew how to play bongos.",
    "The thunderous roar of the jet overhead confirmed her worst fears.",
    "We have young kids who often walk into our room at night for various reasons including clowns in the closet.",
    "Please tell me you don't work in a morgue.",
    "Garlic ice-cream was her favorite.",
    "She says she has the ability to hear the soundtrack of your life.",
    "Normal activities took extraordinary amounts of concentration at the high altitude.",
    "I'm confused: when people ask me what's up, and I point, they groan.",
    "Excitement replaced fear until the final moment.",
    "The crowd yells and screams for more memes."
];

const randomUsers = [
    {
        id: "14a0cb61-e65b-4718-a4f6-684da4fac6c9",
        username:  "Wren Clements"
    },
    {
        id: "e9ddd4ec-8f86-487d-8c43-97f90a93642d",
        username:  "Fisher Hart"
    },
    {
        id: "218c0e09-4b31-4979-8c78-6d278c4c43bb" ,
        username:  "Gemma Schmidt"
    },
    {
        id: "c6e363c1-a735-4e32-ad42-756c3de7878c",
        username:  "Zayden Alvarado"
    },
    {
        id: "3db54d11-5319-45cd-87f7-ecc50bee5807",
        username:  "Blake Hickman"
    },
];