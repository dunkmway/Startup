(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyAhLx9oyqo-aZG4jDq3-4Qplv_mrFXE8cU",
    v: "weekly",
});

const BYU_COORDS = { lat: 40.2522015, lng: -111.6493083 } // coordinates of BYU
const INITIAL_RECT_ZOOM_LEVEL = 50; //percentage that the rectangle will fill on the screen when first loaded
const INITIAL_MAP_ZOOM = 14; // initial map zoom level

// Request needed libraries.
const { Map, Rectangle } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

export class GoogleMap {
    constructor(wrapper, position = BYU_COORDS, bounds = null) {
        const calculatedZoom = bounds ? _getZoomLevelFromBound(wrapper, bounds) : INITIAL_MAP_ZOOM;
        this.map = new Map(wrapper, {
            zoom: calculatedZoom,
            center: position,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
            rotateControl: false,
            fullscreenControl: false,
            draggable: false,
            scrollwheel: false,
            panControl: false,
            maxZoom: calculatedZoom,
            minZoom: calculatedZoom,
            mapId: '89b292be883fd595'
        });

        this._markers = [];

        if (bounds) {
            this._markers = [
                new AdvancedMarkerElement({ position: { lat: bounds.north, lng: bounds.east } }),
                new AdvancedMarkerElement({ position: { lat: bounds.south, lng: bounds.west } })
            ]
    
            this.rectangle = new Rectangle({
                map: this.map,
                bounds
            })
        }
    }

    enableMovement() {
        this.map.setOptions({
            zoomControl: true,
            fullscreenControl: true,
            draggable: true,
            scrollwheel: true,
            panControl: true,
            maxZoom: 999,
            minZoom: 0,
        })
    }

    // add an event listner to the map to handle adding rectangles
    enableEdit() {
        this.map.setOptions({
            zoomControl: true,
            fullscreenControl: true,
            draggable: true,
            scrollwheel: true,
            panControl: true,
            maxZoom: 999,
            minZoom: 0,
        })

        this.rectangle && this.rectangle.setOptions({
            editable: true,
            draggable: true,
        })

        this.map.addListener("click", (e) => {
            const totalCorners = this._markers.length;
            const marker = new AdvancedMarkerElement({ position: e.latLng })
    
            switch (totalCorners) {
                case 0:
                    // no markers
                    // add the marker to the array and the map
                    this._markers.push(marker);
                    marker.setMap(this.map);
                    break;
                case 1:
                    // single marker
                    // this will be the second marker so add the rectangle
                    // and hide the markers
                    this._markers.push(marker);
                    this._markers.forEach(marker => marker.setMap(null));
                    this.rectangle = new Rectangle({
                        bounds: Bounds.fromCorners(this._markers),
                        editable: true,
                        draggable: true,
                        geodesic: true
                    })
                    this.rectangle.setMap(this.map);
                    break;
                case 2:
                    // there are already two markers and a rectangle
                    // remove everything
                    this.rectangle.setMap(null);
                    this.rectangle = null;
                    this._markers = [];
                    break;
                default:
                    // this shouldn't happen
            }
        });
    }

    getBounds() {
        if (!this.rectangle) return null;
        return Bounds.fromRectangle(this.rectangle);
    }
}

function _getZoomLevelFromBound(wrapper, bounds) {
    const mapHeight = wrapper.offsetHeight;
    
    const boundHeight_deg = bounds.north - bounds.south;
    const boundHeight_meter = boundHeight_deg * 110574;
    const desiredMapHeight = boundHeight_meter * 100 / INITIAL_RECT_ZOOM_LEVEL;

    const zoom = Math.log2(mapHeight * 156543.03392 * Math.cos(bounds.north * Math.PI / 180) / desiredMapHeight);

    return Math.floor(zoom)
}

export class Bounds {
    constructor(boundsObj) {
        this.north = boundsObj.north;
        this.south = boundsObj.south;
        this.east = boundsObj.east;
        this.west = boundsObj.west;
    }

    center() {
        return {
            lat: (this.north + this.south) / 2,
            lng: (this.east + this.west) / 2
        }
    }

    contains(lat, lng) {
        return this.north >= lat &&
        this.south <= lat &&
        this.east >= lng &&
        this.west <= lng
    }

    distanceFrom(lat, lng) {
        if (this.contains(lat, lng)) return 0;

        const { lat: closeLat, lng: closeLng } = this.closestPointTo(lat, lng);
        return Geo.distance(closeLat, closeLng, lat, lng);
    }

    angleFrom(lat, lng) {
        if (this.contains(lat, lng)) return null;

        const { lat: closeLat, lng: closeLng } = this.closestPointTo(lat, lng);
        return Geo.fromBearingToDeg(Geo.bearing(lat, lng, closeLat, closeLng));
    }

    directionFromDegree(degree) {
        if (degree == null) return null;

        const directions = ['E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW', 'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE'];
        const index = Math.round(degree / 22.5) % 16;
        return directions[index];
    }

    closestPointTo(lat, lng) {
        // check if inline with bounds
        let closeLat, closeLng
        if (lat < this.north && lat > this.south) {
            closeLat = lat;
        }
        if (lng < this.east && lat > this.west) {
            closeLng = lng;
        }

        // if we weren't inline then we are at a corner
        if (!closeLat) {
            closeLat = (Math.abs(lat - this.north) < Math.abs(lat - this.south)) ? this.north : this.south;
        }
        if (!closeLng) {
            closeLng = (Math.abs(lng - this.east) < Math.abs(lng - this.west)) ? this.east : this.west;
        }
        return {
            lat: closeLat,
            lng: closeLng
        }
    }

    /**
     * Determine if the bounds is within a certain radius of the origin latitude and origin longitude
     * @param {Number} originLat in degrees
     * @param {Number} originLng in degrees
     * @param {Number} radius in miles
     * @returns {Boolean}
     */
    isWithinRadius(originLat, originLng, radius) {
        const { lat, lng } = this.center();
        return Geo.distance(lat, lng, originLat, originLng) <= radius / 69;
    }

    static fromCorners(corners) {
        if (corners.length != 2) return null;
    
        const cornerPos = corners.map(marker => marker.position);
        const [north, south] = cornerPos[0].lat > cornerPos[1].lat ? [cornerPos[0].lat, cornerPos[1].lat] : [cornerPos[1].lat, cornerPos[0].lat];
        const [east, west] = cornerPos[0].lng > cornerPos[1].lng ? [cornerPos[0].lng, cornerPos[1].lng] : [cornerPos[1].lng, cornerPos[0].lng];
    
        return new Bounds({ north, south, east, west });
    }

    static fromRectangle(rectangle) {
        if (!rectangle) return null;
        return new Bounds({
            north: rectangle.getBounds().getNorthEast().lat(),
            south: rectangle.getBounds().getSouthWest().lat(),
            east: rectangle.getBounds().getNorthEast().lng(),
            west: rectangle.getBounds().getSouthWest().lng()
        })
    }
}

export class Geo {
    static earthRadiusKm = 6371;

    static distance(lat1, lng1, lat2, lng2) {
        const dLat = Geo.toRadians(lat2 - lat1);
        const dLng = Geo.toRadians(lng2 - lng1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(Geo.toRadians(lat1)) * Math.cos(Geo.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = Geo.earthRadiusKm * c;
        return Geo.toMiles(distance);
    }

    static bearing(lat1, lng1, lat2, lng2) {
        // convert to radians
        lat1 = Geo.toRadians(lat1);
        lng1 = Geo.toRadians(lng1);
        lat2 = Geo.toRadians(lat2);
        lng2 = Geo.toRadians(lng2);

        // calcultion
        const deltaLng = lng2 - lng1;
        const X = Math.cos(lat2) * Math.sin(deltaLng);
        const Y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
        return Geo.toDegrees(Math.atan2(X, Y)) % 360;
    }

    static toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    static toDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    static toMiles(kilometers) {
        const milesConversion = 0.621371;
        return kilometers * milesConversion;
    }

    static toKilometers(miles) {
        const kmConversion = 1.60934;
        return miles * kmConversion;
    }

    static fromBearingToDeg(bearing) {
        return (90 - bearing) % 360;
    }

    static changeInLatitude(miles) {
        return Geo.toDegrees(miles / Geo.toMiles(Geo.earthRadiusKm))
    }

    static changeInLongitude(latitude, miles) {
        const radius = Geo.earthRadiusKm * Math.cos(Geo.toRadians(latitude));
        return Geo.toDegrees(miles / radius);
    }
}