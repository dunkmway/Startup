const express = require('express');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
app.disable('etag');
app.use(`/api`, require('./src/hello.js'));
app.use(`/api`, require('./src/database.js'));
app.use(`/api`, require('./src/mongodb.js'));

app.use('/api/*', (req, res) => {
    res.sendStatus(404);
})

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
