import React from "react";
import Place from "../../components/place/place";
import "./home.css"

import { query, where } from "../../utils/scripts/_database.mjs"
import { debounce } from "../../utils/scripts/_helpers.mjs";
import { Geo } from "../../utils/scripts/_maps.mjs";

export function Home({ location }) {
    const [distance, setDistance] = React.useState('5');
    const [loading, setLoading] = React.useState(true);
    const [places, setPlaces] = React.useState([]);

    const milesChanged = React.useCallback(debounce((location, distance) => {
        if (location) {
            const latitude = location.coords.latitude;
            const longitude = location.coords.longitude;
            
            const dLat = Geo.changeInLatitude(parseInt(distance));
            const dLng = Geo.changeInLongitude(latitude, parseInt(distance));
            query('places',
            where('bounds.north', '$gte', latitude - dLat),
            where('bounds.south', '$lte', latitude + dLat),
            where('bounds.east', '$gte', longitude - dLng),
            where('bounds.west', '$lte', longitude + dLng)
            )
            .then(closePlaces => {
                setPlaces(closePlaces);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
        }
    }), []);

    React.useEffect(() => milesChanged(location, distance), [location, distance])

    function closeMilesOnKeydown(event) {
        event.preventDefault();
        const target = event.target;
        const key = event.key;
    
        // if numeric
        const numeric = new RegExp('^[0-9]{1}$');
        let value = target.value;
        if (numeric.test(key)) {
            value = value === '0' ? '' : value;
            value += key;
            setDistance(value);
            setLoading(true);
        } else if (key === 'Backspace' || key === 'Delete') {
            value = value.slice(0, -1);
            value = value.length !== 0 ? value : '0';
            setDistance(value);
            setLoading(true);
        }
    }

    const loadingPlaces = (
        <>
            <div className="place">
                <div className="placeholder shimmer"></div>
            </div>
            <div className="place">
                <div className="placeholder shimmer"></div>
            </div>
            <div className="place">
                <div className="placeholder shimmer"></div>
            </div>
            <div className="place">
                <div className="placeholder shimmer"></div>
            </div>
        </>
    )

    return (
        <main>
            <div className="title">
                <h2>Places Near Me</h2>
                <p>Places within
                    <input
                        type="text"
                        id="closeMiles"
                        value={distance}
                        onChange={() => {}}
                        onKeyDown={closeMilesOnKeydown}
                        size={distance.length}
                    ></input>
                    miles.
                </p>
            </div>
            <section id="close-places" className="place-grid">
                {loading ? loadingPlaces : places.map(doc => <Place doc={doc} key={doc._id} >Edit</Place>)}
            </section>
        </main>
    )

}