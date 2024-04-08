import React from "react";
import { NavLink } from 'react-router-dom';
import "./profile.css"

import { query, where } from '../../utils/scripts/_database.mjs';
import Place from "../../components/place/place";

export function Profile({ user }) {
    const [loading, setLoading] = React.useState(true);
    const [places, setPlaces] = React.useState([]);

    React.useEffect(() => {
        query('places', where('creator._id', '$eq', user._id))
        .then(userPlaces => {
            setPlaces(userPlaces);
            setLoading(false);
        })
    }, []);

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
        <main className="profile">
            <div className="heading">
                <h2>My Places</h2>
                <NavLink to="/new-place"><button>New Place</button></NavLink>
            </div>
            <section id="places" className="place-grid">
                {
                    loading ? loadingPlaces :
                    places.length > 0 ? places.map(doc => <Place doc={doc} key={doc._id} >Edit</Place>) :
                    <>
                        <div className="meme">
                            <p>NO PLACES?</p>
                            <img src="images/NoPlaces.jpg"/>
                        </div>
                        <h2>Creating your first place!</h2>
                        <NavLink to="/new-place"><button>New Place</button></NavLink>
                    </>

                }
            </section>
        </main>
    );

}