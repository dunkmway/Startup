import React from "react";
import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap  } from '@vis.gl/react-google-maps'

const BYU_COORDS = { lat: 40.2522015, lng: -111.6493083 } // coordinates of BYU
const INITIAL_RECT_ZOOM_LEVEL = 50; //percentage that the rectangle will fill on the screen when first loaded
const INITIAL_MAP_ZOOM = 14; // initial map zoom level
const GOOGLE_MAP_API = 'AIzaSyAhLx9oyqo-aZG4jDq3-4Qplv_mrFXE8cU';


export function GoogleMap({ bounds }) {
    const [height, setHeight] = React.useState();
    const map = React.useRef(null);

    const position = bounds ? bounds.center() : BYU_COORDS;
    const calculatedZoom = bounds ? _getZoomLevelFromBound(height, bounds) : INITIAL_MAP_ZOOM;
    
    React.useEffect(() => {
        if (map.current) {
            setHeight(map.current.offsetHeight);
        }
    }, []);

    return (
        <div ref={map} className="map">
            <APIProvider apiKey={GOOGLE_MAP_API}>
                <Map
                    zoom={calculatedZoom}
                    center={position}
                    streetViewControl={false}
                    zoomControl={false}
                    mapTypeControl={false}
                    rotateControl={false}
                    fullscreenControl={false}
                    scrollwheel={false}
                    draggable={false}
                    panControl={false}
                    maxZoom={calculatedZoom}
                    minZoom={calculatedZoom}
                    controlled={false}
                >
                    <Rectangle bounds={bounds}/>
                </Map>
            </APIProvider>
        </div>
    );
}
    
function Rectangle({ bounds }) {
    const map = useMap();
    const mapsLibrary = useMapsLibrary('maps');
    
    React.useEffect(() => {
        if (!mapsLibrary) return;
    
        new mapsLibrary.Rectangle({
            map,
            bounds
        });

    }, [mapsLibrary, map]);
}

function _getZoomLevelFromBound(mapHeight = 400, bounds) {
    const boundHeight_deg = bounds.north - bounds.south;
    const boundHeight_meter = boundHeight_deg * 110574;
    const desiredMapHeight = boundHeight_meter * 100 / INITIAL_RECT_ZOOM_LEVEL;

    const zoom = Math.log2(mapHeight * 156543.03392 * Math.cos(bounds.north * Math.PI / 180) / desiredMapHeight);

    return Math.floor(zoom)
}