import React from "react";
import { Bounds } from "../../utils/scripts/_maps.mjs";
import { GoogleMap } from "../GoogleMap/GoogleMap";

export default function Place(props) {
    const doc = props.doc;
    const bounds = new Bounds(doc.bounds);

    return (
        <div className="place">
            <GoogleMap bounds={bounds} ></GoogleMap>
            <div className="body">
                <div className="header">
                    <h3>{doc.name}</h3>
                    <p className="creator">{doc.creator.username}</p>
                </div>
                <p>{doc.description}</p>
            </div>
            <button>{props.children}</button>
        </div>
    )
}