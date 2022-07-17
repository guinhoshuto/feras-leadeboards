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
const params_users = feras.join('&login=')

router.get('/', async function(req, res, next) {
    const url = `https://api.twitch.tv/helix/streams?user_login=${params}`;
    const url_users = `https://api.twitch.tv/helix/users?login=${params_users}`; 
    console.log(url_users)
    let online, streamers;
    try{
      const data = await axios.get(url, headers);
      online = data.data.data;
    } catch(e){
      console.log('e',e)
      res.status(500).json({'message1': e})  
    }
    try{
      const data_users = await axios.get(url_users, headers)
      streamers = data_users.data.data;
    } catch(e){
      console.log('e',e)
      res.status(500).json({'message12': e})  
    }
    const response = [];

    feras.forEach(fera => {
      const feraOnline = online.find(f => f.user_login === fera);
      const streamer = streamers.find(s => s.login === fera);

      const ferasStats = {
        is_live: feraOnline ? true : false, 
        title: feraOnline ? feraOnline.title : '',
        viewer_count: feraOnline ? feraOnline.viewer_count : '', 
        game_name: feraOnline ? feraOnline.game_name : '', 
        user_name: feraOnline ? feraOnline.user_name : '',
        started_at: feraOnline ? feraOnline.started_at : '',
        language: feraOnline ? feraOnline.language : '',
        thumbnail_url: feraOnline ? feraOnline.thumbnail_url : '',
        user_id: feraOnline ? feraOnline.user_id : '',
        profile_image_url: streamer.profile_image_url,
        offline_image_url: streamer.offline_image_url,
        view_count: streamer.view_count
      }

      response.push({
        fera: fera, 
        ... ferasStats
      })
    });
    res.json({response})
});

module.exports = router
