import React, { useCallback, useEffect, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import { Bounds } from "../../utils/scripts/_maps.mjs";

const BYU_COORDS = { lat: 40.2522015, lng: -111.6493083 } // coordinates of BYU
const INITIAL_RECT_ZOOM_LEVEL = 50; //percentage that the rectangle will fill on the screen when first loaded
const INITIAL_MAP_ZOOM = 14; // initial map zoom level
const GOOGLE_MAP_API = 'AIzaSyAhLx9oyqo-aZG4jDq3-4Qplv_mrFXE8cU';


export function GoogleMap({ center, bounds, editable, movable, setBounds }) {
    const initialMarkers = bounds ?
    [
        { position: { lat: bounds.north, lng: bounds.east } },
        { position: { lat: bounds.south, lng: bounds.west } }
    ] : [];

    const [height, setHeight] = useState();
    const [markers, setMarkers] = useState(initialMarkers);
    const map = useRef(null);

    editable = !!editable;
    movable = !!movable;

    const position = center || (bounds && bounds.center()) || BYU_COORDS;
    const calculatedZoom = bounds ? _getZoomLevelFromBound(height, bounds) : INITIAL_MAP_ZOOM;
    
    useEffect(() => {
        if (map.current) {
            setHeight(map.current.offsetHeight);
        }
    }, []);

    const handleOnClick = useCallback((ev) => {
        if (!editable) return;

        const latLng = ev.detail.latLng;
        const totalCorners = markers.length;
        const marker = { position: latLng }

        switch (totalCorners) {
            case 0:
                // no markers
                // add the marker to the array and the map
                setMarkers([...markers, marker]);
                break;
            case 1:
                // single marker
                // this will be the second marker so add the rectangle
                // and hide the markers
                const newMarkers = [...markers, marker];
                setMarkers(newMarkers);
                setBounds(Bounds.fromCorners(newMarkers));
                
                break;
            case 2:
                // there are already two markers and a rectangle
                // remove everything
                setBounds(null);
                setMarkers([]);
                break;
            default:
                // this shouldn't happen
        }
    });

    return (
        <div ref={map} className="map">
            {
                calculatedZoom && position &&
                <APIProvider apiKey={GOOGLE_MAP_API}>
                    <Map
                        streetViewControl={false}
                        zoomControl={editable || movable}
                        mapTypeControl={false}
                        rotateControl={false}
                        fullscreenControl={editable || movable}
                        scrollwheel={editable || movable}
                        draggable={editable || movable}
                        panControl={editable || movable}
                        mapId ={'89b292be883fd595'}

                        defaultCenter={position}
                        defaultZoom={calculatedZoom}

                        onClick={handleOnClick}
                    >
                        { bounds && <Rectangle bounds={bounds} editable={editable} /> }
                        { !bounds && markers.map((marker, index) => <AdvancedMarker key={index} position={marker.position}></AdvancedMarker>) }
                    </Map>
                </APIProvider>
            }
        </div>
    );
}
    
function Rectangle({ bounds, editable }) {
    const map = useMap();
    const mapsLibrary = useMapsLibrary('maps');
    
    useEffect(() => {
        if (!mapsLibrary) return;
    
        const rect = new mapsLibrary.Rectangle({
            map,
            bounds,
            editable: editable,
            draggable: editable
        });

        return () => {
            rect.setMap(null);
        }

    }, [mapsLibrary, map]);
}

function _getZoomLevelFromBound(mapHeight, bounds) {
    if (!mapHeight || !bounds) return null;
    const boundHeight_deg = bounds.north - bounds.south;
    const boundHeight_meter = boundHeight_deg * 110574;
    const desiredMapHeight = boundHeight_meter * 100 / INITIAL_RECT_ZOOM_LEVEL;

    const zoom = Math.log2(mapHeight * 156543.03392 * Math.cos(bounds.north * Math.PI / 180) / desiredMapHeight);

    return Math.floor(zoom)
}