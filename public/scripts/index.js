import "./_auth.mjs";
import Place from "./_Place.mjs";
import { query } from "./_database.mjs"

async function initialize() {
    const places = await query('places');

    places.forEach(async placeDoc => {
        const place = new Place(placeDoc);
        place.render(
            document.getElementById('all-places'),
            () => location.href = `place.html?e=${place.id}`,
            'View'
        )
    });
}

initialize()