const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to PlanetScale!');

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


router.get('/:channel', async function(req, res, next) {
  const channel = req.params.channel;
  try {
    const channelInfo = await axios.get(`https://api.streamelements.com/kappa/v2/channels/${channel}`, params)
    try { 
      const leaderboard = await axios.get(`https://api.streamelements.com/kappa/v2/points/${channelInfo.data._id}/top?limit=1000&offset=0`, params)
      const users = leaderboard.data.users;

      connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        users.forEach(l => {
          // let sql = "SELECT * FROM ferasLeaderboard"
          let sql = 
          `INSERT INTO ferasLeaderboard (user, channel, channelId, points)
          VALUES ("${l.username}", "${channelInfo.data.username}", "${channelInfo.data._id}", ${l.points}) ON DUPLICATE KEY UPDATE channel = "${channelInfo.data.username}", channelId = "${channelInfo.data._id}", points = ${l.points};`; 
          console.log(sql);
          connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted", result);
          });
        })
      });
      connection.end();
      res.json(users)

    } catch (e) {
      res.status(500).json({'message': 'deu ruim pra achar o leaderboard' + e})
    }
  } catch (e){
    res.status(500).json({'message': 'deu ruim pra achar o user' + e})
  }
})

module.exports = router;
