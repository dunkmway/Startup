import "./_auth.mjs";
import Event from "./_Event.mjs";
import { restartJavascriptDeliverable } from "./_helpers.mjs";

document.getElementById('restart').addEventListener('click', restartJavascriptDeliverable)


async function initialize() {
    const eventIDsString = localStorage.getItem(`events`) ?? "[]";
    const eventIDs = JSON.parse(eventIDsString);

    eventIDs.forEach(async eventID => {
        const event = new Event(eventID);
        await event.load();
        event.render(
            document.getElementById('live-events'),
            () => location.href = `event.html?e=${eventID}`,
            'View'
        )
    });
}

initialize()