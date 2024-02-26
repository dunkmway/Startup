import "./_auth.mjs";
import Place from "./_Place.mjs";
import { restartJavascriptDeliverable } from "./_helpers.mjs";

document.getElementById('restart').addEventListener('click', restartJavascriptDeliverable)


async function initialize() {
    const placeIDsString = localStorage.getItem(`places`) ?? "[]";
    const placeIDs = JSON.parse(placeIDsString);

    placeIDs.forEach(async placeID => {
        const place = new Place(placeID);
        await place.load();
        place.render(
            document.getElementById('all-places'),
            () => location.href = `place.html?e=${placeID}`,
            'View'
        )
    });
}

initialize()