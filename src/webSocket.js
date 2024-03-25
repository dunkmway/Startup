const { WebSocketServer } = require('ws');

// Create a websocket object
const wss = new WebSocketServer({ noServer: true });

// Handle the protocol upgrade from HTTP to WebSocket
function protocolUpgrade(server) {
    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    });
}

// Keep track of all the connections so we can forward messages
let chats = {}
let id = 0;

wss.on('connection', (ws) => {
  const connection = { id: ++id, alive: true, ws: ws };

  // Forward messages to everyone except the sender
  ws.on('message', function message(message) {
    // get the data from the message
    const data = JSON.parse(message.toString());
    console.log(data)

    // if no place was passed to the message we can't do anything
    if (!data.place) return;

    // handle the two types of messages
    // 1. a user is specifiying that they would like to listen to a chat
    // 2. a user is sending a message for a chat
    const chatConnections = chats[data.place] ? chats[data.place] : chats[data.place] = [];
    switch (data.type) {
        case 'listen':
            // set up the chat object
            connection.chat = data.place;
            chatConnections.push(connection);

            break;
        case 'send':
            chatConnections.forEach((c) => {
                if (c.id !== connection.id) {
                  c.ws.send(message);
                }
              });
            break;
        default:
            // message not formatted correctly
    }
  });

  // Remove the closed connection so we don't try to forward anymore
  ws.on('close', () => {
    // remove from chat
    const chat = connection?.chat;
    if (chat) {
        const chatConnections = chats[chat];
        const chatPos = chatConnections.findIndex((o, i) => o.id === connection.id);
        if (chatPos >= 0) {
        chatConnections.splice(chatPos, 1);
        }
    }
  });

  // Respond to pong messages by marking the connection alive
  ws.on('pong', () => {
    connection.alive = true;
  });
});

// Keep active connections alive
setInterval(() => {
    for (const chat in chats) {
        chats[chat].forEach((c) => {
            // Kill any connection that didn't respond to the ping last time
            if (!c.alive) {
              c.ws.terminate();
            } else {
              c.alive = false;
              c.ws.ping();
            }
          });   
    }
}, 10000);

module.exports = { protocolUpgrade };