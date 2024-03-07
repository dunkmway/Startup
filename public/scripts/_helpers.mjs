import { setCurrentUser, signOutUser } from "./_auth.mjs";
import { getDoc, saveDoc } from "./_database.mjs";

export function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}

export function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
}

export async function restartDemo() {
  const confirmation = confirm('Are you sure you want to restart the entire demo? This will delete the entire testing database and reset the demo data.')
  if (confirmation) {
    localStorage.clear();
    await fetch('/api/database/restart');
    await setupTestData();
    window.location.replace('index.html');
  }
}

async function setupTestData() {
  let demoUser = await getDoc('users', 'demo-user-1');
  if (!demoUser.data) {
      demoUser = await saveDoc('users', 'demo-user-1', {
          username: 'duncan',
          password: 'abc123'
      });
  }
  await setCurrentUser(demoUser.id);
  await Promise.all([
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
  signOutUser();
}