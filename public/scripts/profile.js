import { getCurrentUser } from "./_auth.mjs";
import Place from "./_Place.mjs";

async function initialize() {
    const user = getCurrentUser();
    const placeIDsString = localStorage.getItem(`${user.id}_places`) ?? "[]";
    const placeIDs = JSON.parse(placeIDsString);

    placeIDs.forEach(async placeID => {
        const place = new Place(placeID);
        await place.load();
        place.render(
            document.getElementById('places'),
            () => location.href = `new-place.html?e=${placeID}`,
            'Edit'
        )
    });
}

initialize()