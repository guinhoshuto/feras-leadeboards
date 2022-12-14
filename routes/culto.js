const express = require('express');
const router = express.Router();
const db = require('../db')

// const thread = "https://twitter.com/guzcalp/status/1565054846956445697";

// router.post('/culto/lore', async function (req, res, next) {
//     const conn =  await db.connect();
//     const query = "INSERT "
//     conn.query(query) 
//     .then(([users]) => res.json(users))
//     .catch(e => res.status(500).json({'msg': e}))
// });

module.exports = router 