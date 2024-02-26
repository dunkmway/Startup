import "./_auth.mjs";
import Place from "./_Place.mjs";
import { query, where, saveDoc } from "./_database.mjs"
import { restartJavascriptDeliverable } from "./_helpers.mjs";

document.getElementById('restart').addEventListener('click', restartJavascriptDeliverable)


async function initialize() {
    await setupTestData();

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

async function setupTestData() {
    await Promise.all([
        saveDoc('users', 'demo-user-1', {
            username: 'duncan',
            password: 'abc123'
        }),
        saveDoc('places', 'demo-place-1', {
            name: '[DEMO] BYU Football',
            description: 'This is an example place. You must be at the stadium to chat!',
            creator: {
                id: 'demo-user-1',
                username: 'duncan'
            },
            bounds: {
                north: 40.25873092924582,
                south: 40.255766974992234,
                east: -111.65313707077661,
                west: -111.65611968720117
            }
        }),
        saveDoc('places', 'demo-place-2', {
            name: '[DEMO] Talmage Building',
            description: 'Hopefully you are looking at this inside of the Talmage building. That way you can see the chat mesages.',
            creator: {
                id: 'demo-user-1',
                username: 'duncan'
            },
            bounds: {
                north: 40.249943013950976,
                south: 40.249034072921454,
                east: -111.65040438849192,
                west: -111.65163284022074
            }
        }),
        saveDoc('places', 'demo-place-3', {
            name: '[DEMO] Utah',
            description: "Ok last chance. If you're not in Utah then you'll just have to make your own event at your location.",
            creator: {
                id: 'demo-user-1',
                username: 'duncan'
            },
            bounds: {
                north: 41.99446780443201,
                south: 36.99954853587487,
                east: -109.04592699263856,
                west: -114.04230303023621
            }
        }),
        saveDoc('messages', 'demo-message-1', {
            place: 'demo-place-1',
            content: 'Welcome to LavellEdwards stadium! Stay a while and chat with those here right now!',
            author: {
                id: 'demo-user-1',
                username: 'duncan'
            },
            isPublic: true,
            createdAt: 1708917641933
        }),
        saveDoc('messages', 'demo-message-2', {
            place: 'demo-place-2',
            content: 'Ahh the Talmage building...good times. You really need to be there to see the next message.',
            author: {
                id: 'demo-user-1',
                username: 'duncan'
            },
            isPublic: true,
            createdAt: 1708917641933
        }),
        saveDoc('messages', 'demo-message-3', {
            place: 'demo-place-2',
            content: `───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄───
───█▒▒░░░░░░░░░▒▒█───
────█░░█░░░░░█░░█────
─▄▄──█░░░▀█▀░░░█──▄▄─
█░░█─▀▄░░░░░░░▄▀─█░░█
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█`,
            author: {
                id: 'demo-user-1',
                username: 'duncan'
            },
            isPublic: false,
            createdAt: 1708917641933
        }),
        saveDoc('messages', 'demo-message-4', {
            place: 'demo-place-3',
            content: 'Ok good at least your in Utah. The below message has a secret message so you better sign in...',
            author: {
                id: 'demo-user-1',
                username: 'duncan'
            },
            isPublic: true,
            createdAt: 1708917641933
        }),
        saveDoc('messages', 'demo-message-5', {
            place: 'demo-place-3',
            content: 'Shrimps is bugs!',
            author: {
                id: 'demo-user-1',
                username: 'duncan'
            },
            isPublic: false,
            createdAt: 1708917641933
        })
    ])
}