const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();

const feras = [
    'rubiaarmond',
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
    const response = [];

    feras.forEach(fera => {
      const feraOnline = online.find(f => f.user_login === fera);
      console.log(feraOnline)

      const ferasStats = {
        is_live: feraOnline ? true : false, 
        title: feraOnline ? feraOnline.title : '',
        viewer_count: feraOnline ? feraOnline.viewer_count : '', 
        game_name: feraOnline ? feraOnline.game_name : '', 
        user_name: feraOnline ? feraOnline.user_name : '',
        started_at: feraOnline ? feraOnline.started_at : '',
        language: feraOnline ? feraOnline.language : '',
        thumbnail_url: feraOnline ? feraOnline.thumbnail_url : '',
        user_id: feraOnline ? feraOnline.user_id : ''
      }

      response.push({
        fera: fera, 
        ... ferasStats
      })
    });
    res.json({response})
});

module.exports = router