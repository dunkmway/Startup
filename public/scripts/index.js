import "./_auth.mjs";
import Place from "./_Place.mjs";
import { query, where } from "./_database.mjs"
import { debounce, getCurrentLocation, removeAllChildNodes } from "./_helpers.mjs";
import { Geo } from "./_maps.mjs";

let LATITUDE, LONGITUDE;
const milesChanged = debounce((distance) => setClosePlaces(LATITUDE, LONGITUDE, distance));

async function initialize() {
    // handle the miles input
    const milesInput = document.getElementById('closeMiles');
    milesInput.addEventListener('keydown', closeMilesOnKeydown);

    // start retreiving all places
    setAllPlaces();

    // get the current location
    try {
        const position = await getCurrentLocation(false, 10000, 0);
        LATITUDE = position.coords.latitude;
        LONGITUDE = position.coords.longitude;

        setCurrentPlaces(LATITUDE, LONGITUDE);
        setClosePlaces(LATITUDE, LONGITUDE, parseInt(milesInput.value));
    
        
    } catch(err) {
        console.log(err)
    }
}

function closeMilesOnKeydown(event) {
    event.preventDefault();
    const target = event.target;
    const key = event.key;

    // if numeric
    const numeric = new RegExp('[0-9]{1}');
    if (numeric.test(key)) {
        target.value = target.value === '0' ? '' : target.value;
        target.value = target.value + key;
        milesChanged(parseInt(target.value));
    } else if (key === 'Backspace' || key === 'Delete') {
        target.value = target.value.slice(0, -1);
        target.value = target.value.length !== 0 ? target.value : '0';
        milesChanged(parseInt(target.value));
    }
}

async function setCurrentPlaces(latitude, longitude) {
    const currentPlaces = await query('places',
        where('bounds.north', '$gte', latitude),
        where('bounds.south', '$lte', latitude),
        where('bounds.east', '$gte', longitude),
        where('bounds.west', '$lte', longitude)
    )

    const wrapper = document.getElementById('current-places');
    removeAllChildNodes(wrapper);
    currentPlaces.forEach(placeDoc => {
        const place = new Place(placeDoc);
        place.render(
            wrapper,
            () => location.href = `place.html?e=${place._id}`,
            'View'
        )
    });
}

async function setClosePlaces(latitude, longitude, distance) {
    // clear the wrapper
    const wrapper = document.getElementById('close-places');
    removeAllChildNodes(wrapper);
    
    // put in the placeholders
    for (let i = 0; i < 4; i++) {
        const placeholder = document.createElement('div');
        placeholder.className = 'place';
        placeholder.innerHTML = '<div class="placeholder shimmer"></div>';
        wrapper.appendChild(placeholder);
    }
    
    // get the close places
    const dLat = Geo.changeInLatitude(distance);
    const dLng = Geo.changeInLongitude(latitude, distance);
    const closePlaces = await query('places',
        where('bounds.north', '$gte', latitude - dLat),
        where('bounds.south', '$lte', latitude + dLat),
        where('bounds.east', '$gte', longitude - dLng),
        where('bounds.west', '$lte', longitude + dLng)
    );

    // render them
    removeAllChildNodes(wrapper);
    closePlaces.forEach(placeDoc => {
        const place = new Place(placeDoc);
        place.render(
            wrapper,
            () => location.href = `place.html?e=${place._id}`,
            'View'
        )
    });
}

async function setAllPlaces() {
    const allPlaces = await query('places');

    const wrapper = document.getElementById('all-places');
    removeAllChildNodes(wrapper);
    allPlaces.forEach(placeDoc => {
        const place = new Place(placeDoc);
        place.render(
            wrapper,
            () => location.href = `place.html?e=${place._id}`,
            'View'
        )
    });
}

initialize()