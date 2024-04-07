import { getCurrentUser } from "./_auth.mjs";
import { query, where } from "./_database.mjs";
import Place from "./_Place.mjs";
import { removeAllChildNodes } from "./_helpers.mjs";

async function initialize() {
    const user = await getCurrentUser()
    const userPlaces = await query('places', where('creator._id', '$eq', user._id));

    const wrapper = document.getElementById('places');
    removeAllChildNodes(wrapper);

    if (userPlaces.length === 0) {
        const empty = document.createElement('div');
        empty.id = 'emptyMessage';
        empty.innerHTML = `
        <div class="meme">
            <p>NO PLACES?</p>
            <img src="images/NoPlaces.jpg">
        </div>
        <h2>Creating your first place!</h2>
        <a href="new-place.html"><button>New Place</button></a>
        `
        wrapper.appendChild(empty);
        return;
    }

    userPlaces.forEach(async placeDoc => {
        const place = new Place(placeDoc);
        place.render(
            wrapper,
            () => location.href = `new-place.html?e=${place._id}`,
            'Edit'
        )
    });
}

initialize()
