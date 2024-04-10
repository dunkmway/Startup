import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./new-place.css"

import { GoogleMap } from "../../components/GoogleMap/GoogleMap";
import { Bounds } from "../../utils/scripts/_maps.mjs";
import { deleteDoc, getDoc, saveDoc, where, query } from "../../utils/scripts/_database.mjs";


export function NewPlace({ user, location }) {
    const [loading, setLoading] = useState(true);
    const [placeDoc, setPlaceDoc] = useState();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [bounds, setBounds] = useState();
    const navigate = useNavigate();

    const defaultCenter = !bounds && location?.coords && {lat: location.coords.latitude, lng: location.coords.longitude};

    // on the first load get the query parameter and update the placeID
    useEffect(() => {
        const QUERY_PARAMS = (new URL(document.location)).searchParams;
        if (QUERY_PARAMS.get('p')) {
            getDoc('places', QUERY_PARAMS.get('p'))
            .then(placeDoc => {
                setPlaceDoc(placeDoc);
                if (placeDoc) {
                    setName(placeDoc.name);
                    setDescription(placeDoc.description);
                    setBounds(new Bounds(placeDoc.bounds));
                }
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, [])

    async function handleFormSubmit(e) {
        e.preventDefault();

        const data = {
            name,
            description,
            bounds,
            creator: user
        }

        if (
            !data.name ||
            !data.description ||
            !data.bounds
        ) {
            alert('Please fill out all fields.')
            return;
        }

        await saveDoc('places', placeDoc?._id, data);
        navigate('/profile');
    }

    async function deletePlace() {
        // FIXME: we should do this on the backend
        // would be cool to make it like a database event
        // const message = await query('messages', where('place', '$eq', placeDoc._id))
        // await Promise.all(message.map(doc => deleteDoc('messages', doc._id)))
        await deleteDoc('places', placeDoc._id);
        navigate('/profile');
    }

    return (
        <main className="new-place">
            <div>
                <div className="title-bar">
                    <h1>Edit Place</h1>
                    {placeDoc && <button id="delete" onClick={deletePlace}>Delete</button>}
                </div>
                <div className="content">
                    {
                        loading ?
                        <div className="map">
                            <div id="loading-map" className="placeholder shimmer"></div>
                        </div> :
                        <GoogleMap bounds={bounds} center={defaultCenter} editable={true} setBounds={setBounds}></GoogleMap>
                    }
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" type="text" name="description" rows="8"value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </main>
    );
}