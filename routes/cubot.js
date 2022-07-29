const express = require('express')
const router = express.Router();
const { Client, Intents } = require('discord.js');
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
        const cassinoChannel = cubot.channels.cache.get('896104609188298762');
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
        .then(m => res.json(m))
        .catch(e => res.status(500).json(e))
    })
});


module.exports = router;