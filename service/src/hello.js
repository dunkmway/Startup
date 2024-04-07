const express = require('express');
const router = express.Router();

// Define the home page route
router.get('/hello', function(req, res) {
    res.send('hello world!');
});

module.exports = router;