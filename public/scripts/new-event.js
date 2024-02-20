import "./_maps.mjs";

const BYU_COORDS = {
    lat: 40.2522015,
    lng: -111.6493083
}

const INITIAL_RECT_ZOOM_LEVEL = 50; //percentage that the rectangle will fill on the screen when first loaded
const INITIAL_MAP_ZOOM = 14;

const location_options = {
    // enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

const QUERY_PARAMS = (new URL(document.location)).searchParams;

function initialize() {
    // we have the event in the query parameter
    if (QUERY_PARAMS.get('e')) {
        // edit
        const EVENT_ID = QUERY_PARAMS.get('e');
        const dataString = localStorage.getItem(EVENT_ID);
        if (!dataString) {
            location.href = 'new-event.html'
            return;
        }

        const data = JSON.parse(dataString);

        // fill in the existing data
        fillInData(data);

        // initialize the map with the existing bounds
        initMap(getCenterFromBounds(data.bounds), data.bounds);

        // set up the form submit action
        document.querySelector('form').addEventListener('submit', (ev) => submit(ev, EVENT_ID));

    } else {
        // new
        const EVENT_ID = self.crypto.randomUUID();

        // get the current location and initialize the map
        navigator.geolocation.getCurrentPosition(locationFound, locationNotFound, location_options);

        // set up the form submit action
        document.querySelector('form').addEventListener('submit', (ev) => submit(ev, EVENT_ID));
    }

}

function fillInData(data) {
    document.querySelectorAll('form input').forEach(input => {
        console.log({
            input,
            name: input.name,
            data: data[input.name]
        })
        input.value = data[input.name];
    });
}

// Initialize and add the map
let map, rectangle;
let rect_markers = [];

async function initMap(position = BYU_COORDS, bounds = null) {
    // Request needed libraries.
    const { Map, Rectangle } = await google.maps.importLibrary("maps");
    const { Marker } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        zoom: bounds ? getZoomLevelFromBound(bounds) : INITIAL_MAP_ZOOM,
        center: position,
        streetViewControl: false
    });

    if (bounds) {
        rect_markers = [
            new Marker({
                position: { lat: bounds.north, lng: bounds.east }
            }),
            new Marker({
                position: { lat: bounds.south, lng: bounds.west }
            })
        ]

        rectangle = new Rectangle({
            map,
            bounds,
            editable: true,
            draggable: true,
            geodesic: true
        })
    }

    map.addListener("click", (e) => {
        const totalCorners = rect_markers.length;
        const marker = new Marker({ position: e.latLng })

        switch (totalCorners) {
            case 0:
                // no markers
                // add the marker to the array and the map
                rect_markers.push(marker);
                marker.setMap(map);
                break;
            case 1:
                // single marker
                // this will be the second marker so add the rectangle
                // and hide the markers
                rect_markers.push(marker);
                rect_markers.forEach(marker => marker.setMap(null));
                rectangle = new Rectangle({
                    bounds: getBoundsFromCorners(rect_markers),
                    editable: true,
                    draggable: true,
                    geodesic: true
                })
                rectangle.setMap(map);
                break;
            case 2:
                // there are already two markers and a rectangle
                // remove everything
                rectangle.setMap(null);
                rectangle = null;
                rect_markers = [];
                break;
            default:
                // this shouldn't happen
        }
    });
}

function getZoomLevelFromBound(bounds) {
    const mapDiv = document.getElementById('map');
    const mapHeight = mapDiv.offsetHeight;
    
    const boundHeight_deg = bounds.north - bounds.south;
    const boundHeight_meter = boundHeight_deg * 110574;
    const desiredMapHeight = boundHeight_meter * 100 / INITIAL_RECT_ZOOM_LEVEL;

    const zoom = Math.log2(mapHeight * 156543.03392 * Math.cos(bounds.north * Math.PI / 180) / desiredMapHeight);

    return Math.round(zoom)
}

function getBoundsFromCorners(corners) {
    if (corners.length != 2) return null;

    const cornerPos = corners.map(marker => marker.position);
    const [north, south] = cornerPos[0].lat() > cornerPos[1].lat() ? [cornerPos[0].lat(), cornerPos[1].lat()] : [cornerPos[1].lat(), cornerPos[0].lat()];
    const [east, west] = cornerPos[0].lng() > cornerPos[1].lng() ? [cornerPos[0].lng(), cornerPos[1].lng()] : [cornerPos[1].lng(), cornerPos[0].lng()];

    return { north, south, east, west };
}

function getCenterFromBounds(bounds) {
    return {
        lat: (bounds.north + bounds.south) / 2,
        lng: (bounds.east + bounds.west) / 2
    }
}
  
function locationFound(pos) {
    initMap({
        lng: pos.coords.longitude,
        lat: pos.coords.latitude
    })
}
  
function locationNotFound(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    initMap();
}
  
function getRectangleBounds() {
    if (!rectangle) return null;
    return {
        north: rectangle.getBounds().getNorthEast().lat(),
        east: rectangle.getBounds().getNorthEast().lng(),
        south: rectangle.getBounds().getSouthWest().lat(),
        west: rectangle.getBounds().getSouthWest().lng(),
    }
}

async function submit(event, eventID) {
    event.preventDefault();
    const target = event.target;
    const formData = new FormData(target);

    const data = {
        id: eventID,
        name: formData.get('name'),
        start: formData.get('start'),
        end: formData.get('end'),
        bounds: getRectangleBounds()
    }

    console.log(data);

    if (
        !data.name ||
        !data.start ||
        !data.end ||
        !data.bounds
    ) {
        alert('Please fill out all fields.')
        return;
    }

    await save(data);
    location.href = `new-event.html?e=${data.id}`
}

async function save(data) {
    save_localStorage(data)
}

function save_localStorage(data) {
    // save the event
    localStorage.setItem(data.id, JSON.stringify(data));

    // update the events association
    const eventIDsString = localStorage.getItem('events') ?? "[]";
    let eventIDs = JSON.parse(eventIDsString);
    eventIDs.push(data.id);
    localStorage.setItem('events', JSON.stringify(eventIDs));
}

initialize();