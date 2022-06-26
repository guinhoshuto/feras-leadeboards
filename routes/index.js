const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to PlanetScale!');
connection.end();


const params = {
  headers: {
    "accept": "application/json", 
    "authorization": "bearer undefined", 
    "content-type": "application/json"
  }
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/:user', async function(req, res, next) {
  const user = req.params.user;
  try {
    const userInfo = await axios.get(`https://api.streamelements.com/kappa/v2/channels/${user}`, params)
    try { 
      const leaderboard = await axios.get(`https://api.streamelements.com/kappa/v2/points/${userInfo.data._id}/top?limit=1000&offset=0`, params)
      res.json(leaderboard.data.users)
    } catch (e) {
      res.status(500).json({'message': 'deu ruim pra achar o leaderboard' + e})
    }
  } catch (e){
    res.status(500).json({'message': 'deu ruim pra achar o user' + e})
  }
})

module.exports = router;
