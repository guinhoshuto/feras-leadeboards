const express = require('express')
const router = express.Router();
const { Client, Intents } = require('discord.js');
const db = require('../db');
require('dotenv').config();

const cubot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
    ]
})

router.get('/cassino/fate', function(req, res, next){
    cubot.login(process.env.DISCORD_TOKEN)
    .then(() => {
        // const cassinoChannel = cubot.channels.cache.get('855695828856864799');
        console.log(cubot.channels.cache.get('896104609188298762'))
        cubot.channels.cache.get('855695828856864799').messages.fetch({limit: 100})
        .then(m => res.json(m))
        .catch(e => res.status(500).json(e))
    })
});

router.get('/alberguz/members', function(req, res, next){
    cubot.login(process.env.DISCORD_TOKEN)
    .then(() => {
        const alberguz = cubot.guilds.cache.get('855694948707991593');
        alberguz.members.fetch()
        .then(discordMembers => {
            discordMember = JSON.parse(JSON.stringify(discordMembers));
            const members = [];
            discordMember.forEach(m => members.push([m.userId, m.nickname, m.displayName, m.displayAvatarURL, m.joinedTimestamp]));
            const queryInsertMembers = "INSERT IGNORE INTO guzDiscordMembers (userId, nickname, displayName, displayAvatarUrl, timestamp) VALUES ?";
            db.connect()
            .then(conn => {
                conn.query(queryInsertMembers, [members])
                .then(() => res.json(discordMember))
                .catch((err) => res.status(500).json({'erros': err}))
            })
            .catch(e => res.status(500).json({'erro': e}))
        })
        .catch(e => {
            console.log(e)
            res.status(500).json()})
    })
});

router.get('/copypasta', function(req, res, next){
    const query = `SELECT * FROM copypastas`;
    db.connect()
    .then(conn => {
        conn.query(query)
        .then(response => res.json(response[0]))
        .catch((err) => res.status(500).json({'erros': err}))
    })
    .catch(e => res.status(500).json({'erro': e}))
})

router.get('/copypasta/:nome', function(req, res, next){
    const query = `SELECT * FROM copypastas WHERE nome='${req.params.nome}'`;
    db.connect()
    .then(conn => {
        conn.query(query)
        .then(response => res.json(response[0]))
        .catch((err) => res.status(500).json({'erros': err}))
    })
    .catch(e => res.status(500).json({'erro': e}))
})

router.get('/preceitos', function(req, res, next){
    const query = `SELECT * FROM zotePreceitos`;
    db.connect()
    .then(conn => {
        conn.query(query)
        .then(response => res.json(response[0]))
        .catch((err) => res.status(500).json({'erros': err}))
    })
    .catch(e => res.status(500).json({'erro': e}))
})

router.get('/preceitos/:id', function(req, res, next){
    const query = `SELECT * FROM zotePreceitos WHERE numero='${req.params.id}'`;
    db.connect()
    .then(conn => {
        conn.query(query)
        .then(response => res.json(response[0]))
        .catch((err) => res.status(500).json({'erros': err}))
    })
    .catch(e => res.status(500).json({'erro': e}))
})


module.exports = router;