import React from "react";
// import "./new-place.css"

export function NewPlace() {
    return (
        <>
            <div>
                <div class="title-bar">
                    <h1>Edit Place</h1>
                    <button id="delete" style="display: none;">Delete</button>
                </div>
                <div id="map">
                    <div id="loading-map" class="placeholder shimmer"></div>
                </div>
                <form>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input id="name" type="text" name="name"></input>
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" type="text" name="description" rows="8"></textarea>
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        </>
    );
}