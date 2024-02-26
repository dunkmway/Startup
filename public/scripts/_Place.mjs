import { GoogleMap, Bounds } from "./_maps.mjs"

export default class Place {
    constructor(id) {
        this.id = id;
    }

    async load() {
        const dataString = localStorage.getItem(this.id);
        if (!dataString) return null;

        const data = JSON.parse(dataString);
        Object.assign(this, data);
        return this;
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
                    <p class="countdown"></p>
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