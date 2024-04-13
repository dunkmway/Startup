const express = require('express');
const cookieParser = require('cookie-parser');
const { protocolUpgrade } = require('./src/webSocket.js');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
app.disable('etag');
app.use(`/api`, require('./src/hello.js'));
app.use(`/api`, require('./src/database.js'));
app.use(`/api`, require('./src/auth.js'));

app.use('/api/*', (req, res) => {
    res.sendStatus(404);
})

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// initialize the WebSocketServer
protocolUpgrade(server);
