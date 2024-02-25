import { getCurrentUser } from "./_auth.mjs";
import Event from "./_Event.mjs";

async function initialize() {
    const user = getCurrentUser();
    const eventIDsString = localStorage.getItem(`${user.id}_events`) ?? "[]";
    const eventIDs = JSON.parse(eventIDsString);

    eventIDs.forEach(async eventID => {
        const event = new Event(eventID);
        await event.load();
        event.render(
            document.getElementById('events'),
            () => location.href = `new-event.html?e=${eventID}`,
            'Edit'
        )
    });
}

initialize()