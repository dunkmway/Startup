import { GoogleMap, Bounds } from "./_maps.mjs"

export default class Place {
    constructor(doc) {
        this.id = doc._id;
        Object.assign(this, doc);
    }

    render(container, onclick, btnMsg) {
        const placeWrapper = document.createElement('div');
        placeWrapper.className = 'place';
        placeWrapper.addEventListener('click', onclick)
        placeWrapper.innerHTML = `
            <div class="map">
                <div class="placeholder shimmer"></div>
            </div>
            <div class="body">
                <div class="header">
                    <h3>${this.name}</h3>
                    <p class="creator">${this.creator.username}</p>
                </div>
                <p>${this.description}</p>
            </div>
            <button>${btnMsg}</button>
        `
        container.appendChild(placeWrapper);
    
        const mapWrapper = placeWrapper.querySelector('.map');
        const bounds = new Bounds(this.bounds);
        new GoogleMap(mapWrapper, bounds.center(), bounds);
    }
}