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
        if (!lat || !lng) return null;

        const { lat: closeLat, lng: closeLng } = this.closestPointTo(lat, lng);
        return Geo.distance(closeLat, closeLng, lat, lng);
    }

    angleFrom(lat, lng) {
        if (!lat || !lng) return 450;               // impossible angle to represent bad formatting
        if (this.contains(lat, lng)) return null;   // null to represent at current location

        const { lat: closeLat, lng: closeLng } = this.closestPointTo(lat, lng);
        return Geo.fromBearingToDeg(Geo.bearing(lat, lng, closeLat, closeLng));
    }

    directionFromDegree(degree) {
        if (degree == null) return '';

        const directions = ['E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW', 'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE'];
        const index = Math.round(degree / 22.5) % 16;
        return directions[index];
    }

    closestPointTo(lat, lng) {
        // check if inline with bounds
        let closeLat, closeLng
        if (lat <= this.north && lat >= this.south) {
            closeLat = lat;
        }
        if (lng <= this.east && lng >= this.west) {
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
        return (90 - bearing + 360) % 360;
    }

    static changeInLatitude(miles) {
        return Geo.toDegrees(miles / Geo.toMiles(Geo.earthRadiusKm))
    }

    static changeInLongitude(latitude, miles) {
        const radius = Geo.toMiles(Geo.earthRadiusKm * Math.cos(Geo.toRadians(latitude)));
        return Geo.toDegrees(miles / radius);
    }
}