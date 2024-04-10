import React from "react";
import "./place.css"

export function Place() {
    return (
        <div className="place-page">
            <header>
                <button onClick={history.back()} className="back"></button>
                <h2 id="placeName"></h2>
                <div>
                    <input type="checkbox" id="infoToggle" />
                    <label for="infoToggle" className="info">i</label>
                    <div id="placeDetails">
                        <div>
                            <div className="description">
                                <p></p>
                                <div className="directions">
                                    <div id="compass">
                                        <span>N</span>
                                        <span>E</span>
                                        <span>S</span>
                                        <span>W</span>
                                    </div>
                                    <div>
                                        <span id="distance"></span>
                                        <span id="direction"></span>
                                    </div>
                                </div>
                            </div>
                            {
                                loading ?
                                <div className="map">
                                    <div className="placeholder shimmer"></div>
                                </div> :
                                <GoogleMap bounds={bounds} center={defaultCenter} editable={true} setBounds={setBounds}></GoogleMap>
                            }
                        </div>
                    </div>
                </div>
            </header>

            <main id="chat"></main>
            
            <footer>        
                <form id="user-input">
                    <textarea type="text" id="message-input" name="message" autocomplete="off" disabled></textarea>
                    <button type="submit">
                        <svg id="map-marker" viewBox="-4 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <g id="Vivid.JS" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Vivid-Icons" transform="translate(-125.000000, -643.000000)">
                                        <g id="Icons" transform="translate(37.000000, 169.000000)">
                                            <g id="map-marker" transform="translate(78.000000, 468.000000)">
                                                <g transform="translate(10.000000, 6.000000)">
                                                    <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="#FFFFFF">
                                                    </path>
                                                    <circle id="Oval" fill="#5588ff" fill-rule="nonzero" cx="14" cy="14" r="7"></circle>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
}