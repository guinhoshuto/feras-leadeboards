const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();

const feras = [
    'namiwaa',
    'rafaeldfl',
    'miguelchame',
    'raisupon',
    'mazeeein',
    'mutsukki',
    'stoneofexile',
    'marcellus_v',
    'platynews',
    'guzcalp',
    'alocairo'
]

const headers = {
  headers: {
    "Authorization": process.env.TWITCH_TOKEN, 
    "Client-Id": process.env.TWITCH_CLIENT_ID
  }
}

const params = feras.join('&user_login=')

router.get('/', async function(req, res, next) {
    const url = `https://api.twitch.tv/helix/streams?user_login=${params}`;
    const data = await axios.get(url, headers)
    const online = data.data.data;
    res.json({online})
});

module.exports = router