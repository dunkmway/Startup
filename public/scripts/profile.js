import { getCurrentUser } from "./_auth.mjs";
import { query, where } from "./_database.mjs";
import Place from "./_Place.mjs";

async function initialize() {
    const user = await getCurrentUser()
    const userPlaces = await query('places', where('creator._id', '$eq', user._id));

    userPlaces.forEach(async placeDoc => {
        const place = new Place(placeDoc);
        place.render(
            document.getElementById('places'),
            () => location.href = `new-place.html?e=${place._id}`,
            'Edit'
        )
    });
}

initialize()
