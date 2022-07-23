const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/twitch/kappa', async function (req, res, next) {
    const conn =  await db.connect();
    const query = "SELECT username, kappa FROM `guzTwitchMembers` WHERE kappa > 0 ORDER BY kappa DESC"
    conn.query(query) 
    .then(([users]) => res.json(users))
    .catch(e => res.status(500).json({'msg': e}))
});

router.get('/twitch/members', async function (req, res, next) {
    const conn = await db.connect();
    const query = "SELECT * FROM `guzTwitchMembers` WHERE 1 ORDER BY kappa DESC"
    conn.query(query)
    .then(([users]) => res.json(users))
    .catch(e => res.status(500).json({'msg': e}))
})

router.post('/twitch/members', async function (req, res, next) {
    const conn = await db.connect()
    const queryGuzMembers = "SELECT DISTINCT(user) FROM `ferasLeaderboard` WHERE channel = 'guzcalp'";
    const [users]  = await conn.query(queryGuzMembers);
    const members = [...users].map(u => [u.user])
    const queryInsertMembers = `INSERT IGNORE INTO guzTwitchMembers (username) VALUES ?`
    conn.query(queryInsertMembers, [members], function (err, result) {
        if (err) res.status(500).json({'erro': err});
        console.log("record inserted", result);
    });
    res.json({'msg': 'usuários cadastrados'})
});

router.put('/twitch/:att/:member/:n', async function(req, res, next){
    const n = req.params.n;
    const operator = parseInt(n) < 0 ? '' : '+'; 

    const conn = await db.connect()
    const queryUpdateAtt = `UPDATE guzTwitchMembers SET ${req.params.att} = ${req.params.att} ${operator} ${n} WHERE username = '${req.params.member}'`
    console.log(queryUpdateAtt)
    conn.query(queryUpdateAtt)
    .then(() => res.json({'msg': 'foi'}))
    .catch((e) => res.status(500).json({'e': e}))
});

module.exports = router