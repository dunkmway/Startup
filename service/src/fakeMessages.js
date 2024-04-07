const axios = require('axios');

const RANDOM_USERS = [
    {
        _id: "14a0cb61-e65b-4718-a4f6-684da4fac6c9",
        username:  "Wren Clements"
    },
    {
        _id: "e9ddd4ec-8f86-487d-8c43-97f90a93642d",
        username:  "Fisher Hart"
    },
    {
        _id: "218c0e09-4b31-4979-8c78-6d278c4c43bb" ,
        username:  "Gemma Schmidt"
    },
    {
        _id: "c6e363c1-a735-4e32-ad42-756c3de7878c",
        username:  "Zayden Alvarado"
    },
    {
        _id: "3db54d11-5319-45cd-87f7-ecc50bee5807",
        username:  "Blake Hickman"
    },
];

async function getRandomMessage(place) {
    const result = await axios({
        method: 'GET',
        url: "https://icanhazdadjoke.com",
        headers: {
            "Accept": "application/json",
            "User-Agent": "BYU CS 260 - There (https://github.com/dunkmway/Startup)"
        }
    })
    const dadJoke = result.data.joke;
    const randomUser = RANDOM_USERS[Math.floor(Math.random() * RANDOM_USERS.length)];

    return {
        place,
        content: dadJoke,
        author: randomUser,
        isPublic: Math.random() < 0.1,
        createdAt: new Date().getTime()
    }
}

module.exports = { getRandomMessage };