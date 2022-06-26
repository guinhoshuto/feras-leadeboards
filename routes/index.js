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


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:channel', async function(req, res, next) {
  const now = new Date();
  const conn = await db.connect()
  try {
    const channelInfo = await axios.get(`https://api.streamelements.com/kappa/v2/channels/${req.params.channel}`, params)
    try { 
      const leaderboard = await axios.get(`https://api.streamelements.com/kappa/v2/points/${channelInfo.data._id}/top?limit=1000&offset=0`, params)
      const users = leaderboard.data.users;

      await conn.connect(function(err) {
        if (err) throw err;
      });
      
      console.log("Connected!");
      const sql = `INSERT INTO ferasLeaderboard (user, channel, channelId, points, created_at) VALUES ?`
      const values = []
      users.forEach(l => {
        values.push([l.username, channelInfo.data.username, channelInfo.data._id, l.points, now])
        // let sql = "SELECT * FROM ferasLeaderboard"
        // let sql = 
        // `INSERT INTO ferasLeaderboard (user, channel, channelId, points)
        // VALUES ("${l.username}", "${channelInfo.data.username}", "${channelInfo.data._id}", ${l.points}) ON DUPLICATE KEY UPDATE channel = "${channelInfo.data.username}", channelId = "${channelInfo.data._id}", points = ${l.points};`; 
      })
      console.log(values)
      conn.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("record inserted", result);
      });
      res.json(users)
      // db.end(function(err) {
      // if (err) {
      //   return console.log('error:' + err.message);
      // }
      //   console.log('Close the database connection.');
      // });

    } catch (e) {
      res.status(500).json({'message': 'deu ruim pra achar o leaderboard' + e})
    }
  } catch (e){
    res.status(500).json({'message': 'deu ruim pra achar o user' + e})
  }
})

module.exports = router;
