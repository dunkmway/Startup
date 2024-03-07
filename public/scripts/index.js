import "./_auth.mjs";
import Place from "./_Place.mjs";
import { query } from "./_database.mjs"
import { restartDemo } from "./_helpers.mjs";

document.getElementById('restart').addEventListener('click', restartDemo)


async function initialize() {
    const places = await query('places');

    places.forEach(async placeDoc => {
        const place = new Place(placeDoc);
        place.render(
            document.getElementById('all-places'),
            () => location.href = `place.html?e=${placeDoc.id}`,
            'View'
        )
    });
}

initialize()