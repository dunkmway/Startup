import React from "react";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

// (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
//     key: "AIzaSyAhLx9oyqo-aZG4jDq3-4Qplv_mrFXE8cU",
//     v: "weekly",
// });

const BYU_COORDS = { lat: 40.2522015, lng: -111.6493083 } // coordinates of BYU
const INITIAL_RECT_ZOOM_LEVEL = 50; //percentage that the rectangle will fill on the screen when first loaded
const INITIAL_MAP_ZOOM = 14; // initial map zoom level
const GOOGLE_MAP_API = 'AIzaSyAhLx9oyqo-aZG4jDq3-4Qplv_mrFXE8cU';

// Request needed libraries.
// const { Map, Rectangle } = await google.maps.importLibrary("maps");
// const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

export function GoogleMap(props) {
    let position = props.position;
    let bounds = props.bounds;


    const wrapper = (
        <div className="map">
            <div className="placeholder shimmer"></div>
        </div>
    )



    return (
        <APIProvider apiKey={GOOGLE_MAP_API}>
            <Map zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
        </APIProvider>
    );
}

// export class GoogleMap {
//     constructor(wrapper, position = BYU_COORDS, bounds = null) {
//         const calculatedZoom = bounds ? _getZoomLevelFromBound(wrapper, bounds) : INITIAL_MAP_ZOOM;
//         this.map = new Map(wrapper, {
//             zoom: calculatedZoom,
//             center: position,
//             streetViewControl: false,
//             zoomControl: false,
//             mapTypeControl: false,
//             rotateControl: false,
//             fullscreenControl: false,
//             draggable: false,
//             scrollwheel: false,
//             panControl: false,
//             maxZoom: calculatedZoom,
//             minZoom: calculatedZoom,
//             mapId: '89b292be883fd595'
//         });

//         this._markers = [];

//         if (bounds) {
//             this._markers = [
//                 new AdvancedMarkerElement({ position: { lat: bounds.north, lng: bounds.east } }),
//                 new AdvancedMarkerElement({ position: { lat: bounds.south, lng: bounds.west } })
//             ]
    
//             this.rectangle = new Rectangle({
//                 map: this.map,
//                 bounds
//             })
//         }
//     }

//     enableMovement() {
//         this.map.setOptions({
//             zoomControl: true,
//             fullscreenControl: true,
//             draggable: true,
//             scrollwheel: true,
//             panControl: true,
//             maxZoom: 999,
//             minZoom: 0,
//         })
//     }

//     // add an event listner to the map to handle adding rectangles
//     enableEdit() {
//         this.map.setOptions({
//             zoomControl: true,
//             fullscreenControl: true,
//             draggable: true,
//             scrollwheel: true,
//             panControl: true,
//             maxZoom: 999,
//             minZoom: 0,
//         })

//         this.rectangle && this.rectangle.setOptions({
//             editable: true,
//             draggable: true,
//         })

//         this.map.addListener("click", (e) => {
//             const totalCorners = this._markers.length;
//             const marker = new AdvancedMarkerElement({ position: e.latLng })
    
//             switch (totalCorners) {
//                 case 0:
//                     // no markers
//                     // add the marker to the array and the map
//                     this._markers.push(marker);
//                     marker.setMap(this.map);
//                     break;
//                 case 1:
//                     // single marker
//                     // this will be the second marker so add the rectangle
//                     // and hide the markers
//                     this._markers.push(marker);
//                     this._markers.forEach(marker => marker.setMap(null));
//                     this.rectangle = new Rectangle({
//                         bounds: Bounds.fromCorners(this._markers),
//                         editable: true,
//                         draggable: true,
//                         geodesic: true
//                     })
//                     this.rectangle.setMap(this.map);
//                     break;
//                 case 2:
//                     // there are already two markers and a rectangle
//                     // remove everything
//                     this.rectangle.setMap(null);
//                     this.rectangle = null;
//                     this._markers = [];
//                     break;
//                 default:
//                     // this shouldn't happen
//             }
//         });
//     }

//     getBounds() {
//         if (!this.rectangle) return null;
//         return Bounds.fromRectangle(this.rectangle);
//     }
// }

function _getZoomLevelFromBound(wrapper, bounds) {
    const mapHeight = wrapper.offsetHeight;
    
    const boundHeight_deg = bounds.north - bounds.south;
    const boundHeight_meter = boundHeight_deg * 110574;
    const desiredMapHeight = boundHeight_meter * 100 / INITIAL_RECT_ZOOM_LEVEL;

    const zoom = Math.log2(mapHeight * 156543.03392 * Math.cos(bounds.north * Math.PI / 180) / desiredMapHeight);

    return Math.floor(zoom)
}