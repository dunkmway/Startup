import { getCurrentUser } from "./_auth.mjs";
import { getManyToOneDataFromDatabase } from "./_helpers.mjs"
import { GoogleMap, Bounds } from "./_maps.mjs"

function renderEvent(eventData) {
    const eventWrapper = document.createElement('div');
    eventWrapper.className = 'event';
    eventWrapper.addEventListener('click', () => location.href = `new-event.html?e=${eventData.id}`)
    eventWrapper.innerHTML = `
        <div class="map">
            <div class="placeholder shimmer"></div>
        </div>
        <div class="body">
            <div class="header">
                <h3>${eventData.name}</h3>
                <p class="countdown"></p>
            </div>
            <p>${eventData.description}</p>
        </div>
        <button>Edit</button>
    `
    document.getElementById('events').appendChild(eventWrapper);

    const mapWrapper = eventWrapper.querySelector('.map');
    const bounds = new Bounds(eventData.bounds);
    new GoogleMap(mapWrapper, bounds.center(), bounds);
}

async function initialize() {
    const user = getCurrentUser();
    const events = await getManyToOneDataFromDatabase('event', user.id);
    events.forEach(renderEvent);
}

initialize()