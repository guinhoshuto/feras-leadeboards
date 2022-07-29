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
        const cassinoChannel = cubot.channels.cache.get('855695828856864799');
        console.log(cassinoChannel)
        cassinoChannel.messages.fetch({limit: 100})
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
            discordMember.forEach(m => members.push([m.userId, m.displayName, m.displayAvatarURL, m.joinedTimestamp]));
            // console.log(JSON.stringify(discordMember))
            console.log(members);
            const conn = db.connect();
            const queryInsertMembers = `INSERT IGNORE INTO guzDiscordMembers (userId, displayName, displayAvatarUrl, timestamp) VALUES ?`
            conn.query(queryInsertMembers, members, function (err, result) {
                if (err) res.status(500).json({'erro': err});
                console.log("record inserted", result);
            });
            res.json(discordMember)
        })
        .catch(e => res.status(500).json({'e':e}))
    })
});


module.exports = router;