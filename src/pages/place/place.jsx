import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import "./place.css"

import { GoogleMap } from "../../components/GoogleMap/GoogleMap";
import { Bounds } from "../../utils/scripts/_maps.mjs";
import { getDoc } from "../../utils/scripts/_database.mjs";
import Chat from "../../utils/scripts/_Chat.mjs";
import { Message } from "./Message";

export function Place({ user, location }) {
    const [loading, setLoading] = useState(true);
    const [placeDoc, setPlaceDoc] = useState();
    const [isPublic, setIsPublic] = useState(true);
    const [distance, setDistance] = useState(0);
    const [angle, setAngle] = useState(90);
    const [direction, setDirection] = useState(null);

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);

    const [messageValue, setMessageValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const QUERY_PARAMS = (new URL(document.location)).searchParams;
        if (QUERY_PARAMS.get('p')) {
            getDoc('places', QUERY_PARAMS.get('p'))
            .then(placeDoc => {
                setPlaceDoc(placeDoc);
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        if (!placeDoc) {
            setChat(null);
            setMessages([]);
            return;
        };

        const newChat = new Chat(
            placeDoc._id,
            user,
            setMessages
        );
        newChat.loadMessages()
        .then((newMessages) => {
            setChat(newChat);
            setMessages(newMessages);
        });
    }, [user, placeDoc])

    useEffect(() => {
        // no place doc
        if (!placeDoc) return setIsPublic(true);

        const bounds = new Bounds(placeDoc.bounds);
        const lat = location?.coords.latitude;
        const lng = location?.coords.longitude;

        // is inside the bounds
        if (bounds.contains(lat, lng) && user?._id && location) {
            setIsPublic(false);
        } else {
            setIsPublic(true);
        }

        setDistance(bounds.distanceFrom(lat, lng) ?? 0);
        const newAngle = bounds.angleFrom(lat, lng);
        setAngle(newAngle);
        setDirection(newAngle === 450 ? null : bounds.directionFromDegree(newAngle));

    }, [user, location, placeDoc])

    function handleMessageSubmit(e) {
        e?.preventDefault();
        if (isPublic) return;

        chat.addMessage(messageValue);
        setMessageValue('');
    }

    function handleMessageKeyUp(ev) {
        if (ev.ctrlKey && ev.key == 'Enter') {
            handleMessageSubmit();
        }
    }

    return (
        <div className="place-page">
            <header>
                <button onClick={() => navigate('/')} className="back"></button>
                <h2>{placeDoc?.name}</h2>
                <div>
                    <input type="checkbox" id="infoToggle" />
                    <label htmlFor="infoToggle" className="info">i</label>
                    <div id="placeDetails">
                        <div>
                            <div className="description">
                                <p>{placeDoc?.description}</p>
                                <div className="directions">
                                    <div id="compass" style={{"--rotation": `${-1 * (angle ? angle : 90)}deg`}}>
                                        <span>N</span>
                                        <span>E</span>
                                        <span>S</span>
                                        <span>W</span>
                                    </div>
                                    <div>
                                        {
                                            (!location || !location.coords) && <span>Calculating...</span>
                                        }
                                        <span id="distance">{distance == 0 ? null : `${Math.round(distance * 100) / 100} mi `}</span>
                                        <span id="direction">{direction === '' ? 'You are here!' : direction}</span>
                                    </div>
                                </div>
                            </div>
                            {
                                loading ?
                                <div className="map">
                                    <div className="placeholder shimmer"></div>
                                </div> :
                                <GoogleMap bounds={placeDoc?.bounds} center={placeDoc?.bounds && new Bounds(placeDoc?.bounds).center()} movable={true}></GoogleMap>
                            }
                        </div>
                    </div>
                </div>
            </header>

            <main id="chat">
                {chat && messages.map(message => {
                    return <Message key={message._id} _message={message} isPublicChat={isPublic} ></Message>
                })}
            </main>
            
            <footer>        
                <form id="user-input" onSubmit={handleMessageSubmit}>
                    <textarea
                        value={messageValue}
                        onChange={(e) => setMessageValue(e.target.value)}
                        type="text"
                        id="message-input"
                        name="message"
                        autoComplete="off"
                        disabled={isPublic}
                        onKeyUp={handleMessageKeyUp}
                    >
                    </textarea>
                    <button type="submit">
                        <svg id="map-marker" viewBox="-4 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <g id="Vivid.JS" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Vivid-Icons" transform="translate(-125.000000, -643.000000)">
                                        <g id="Icons" transform="translate(37.000000, 169.000000)">
                                            <g id="map-marker" transform="translate(78.000000, 468.000000)">
                                                <g transform="translate(10.000000, 6.000000)">
                                                    <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="#FFFFFF">
                                                    </path>
                                                    <circle id="Oval" fill="#5588ff" fillRule="nonzero" cx="14" cy="14" r="7"></circle>
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