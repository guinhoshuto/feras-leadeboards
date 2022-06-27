const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require('../db')

const params = {
  headers: {
    "accept": "application/json", 
    "authorization": "bearer undefined", 
    "content-type": "application/json"
  }
}

//Select geral (talvez divida por dia)
router.get('/', async function(req, res, next){
    res.json({oi})
})

//select que traz separado por data data>username filtrado por channel
router.get('/histogram/:channel', async function(req, res, next){
    res.json({oi})
})

router.get('/:channel', async function(req, res, next) {
  try {
    const channelInfo = await axios.get(`https://api.streamelements.com/kappa/v2/channels/${req.params.channel}`, params)
    try { 
      const leaderboard = await axios.get(`https://api.streamelements.com/kappa/v2/points/${channelInfo.data._id}/top?limit=1000&offset=0`, params)
      const users = leaderboard.data.users;
      res.json(users)
    } catch (e) {
      res.status(500).json({'message': 'deu ruim pra achar o leaderboard' + e})
    }
  } catch (e){
    res.status(500).json({'message': 'deu ruim pra achar o user' + e})
  }
})

module.exports = router;