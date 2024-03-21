const uuid = require('uuid');
const bcrypt = require('bcrypt');
const db = require('./mongodb.js');
const express = require('express');
const router = express.Router();

const collection = db.collection('users');

// createAuthorization from the given credentials
router.post('/auth/create', async (req, res) => {
  if (await getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ id: user._id });
  }
});

// loginAuthorization from the given credentials
router.post('/auth/login', async (req, res) => {
  const user = await getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

router.post('/auth/logout', async (req, res) => {
    clearAuthCookie(res);
    res.send({});
  });

// getMe for the currently authenticated user
router.get('/auth/me', async (req, res) => {
  const authToken = req.cookies['token'];
  const user = await collection.findOne({ token: authToken });
  if (user) {
    res.send({
        _id: user._id,
        username: user.username
    });
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

function getUser(username) {
  return collection.findOne({ username: username });
}

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await collection.insertOne(user);

  return user;
}

function setAuthCookie(res, authToken) {
  res.cookie('token', authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearAuthCookie(res) {
    res.clearCookie('token');
}

module.exports = router;