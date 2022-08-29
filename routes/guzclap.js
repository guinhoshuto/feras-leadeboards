const express = require('express');
// const { route } = require('.');
const router = express.Router();
const db = require('../db');

router.post('/gabinete/auth', function(req, res, next){
    if(req.body.pwd === 'cu') {
        res.json({
            token: 'cu'
        })
    }
    res.json({'msg': 'senha errada'})
})

router.get('/twitch/kappa', async function (req, res, next) {
    const conn =  await db.connect();
    const query = "SELECT username, kappa FROM `guzTwitchMembers` WHERE kappa > 0 ORDER BY kappa DESC"
    conn.query(query) 
    .then(([users]) => res.json(users))
    .catch(e => res.status(500).json({'msg': e}))
});

router.get('/twitch/kappames', async function (req, res, next) {
    const conn =  await db.connect();
    const query = "SELECT username, kappaMes FROM `guzTwitchMembers` WHERE kappaMes > 0 ORDER BY kappaMes DESC"
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

router.get('/twitch/:member', async function (req, res, next) {
    const conn = await db.connect();
    const query = "SELECT * FROM `guzTwitchMembers` WHERE username='" + req.params.member + "'";
    conn.query(query)
    .then(([users]) => res.json(users))
    .catch(e => res.status(500).json({'msg': e}))
})

router.post('/twitch/members', async function (req, res, next) {
    const conn = await db.connect()
    const queryGuzMembers = "SELECT DISTINCT(user) FROM `ferasLeaderboard` WHERE channel = 'guzcalp'";
    const [users]  = await conn.query(queryGuzMembers);
    const members = [...users].map(u => [u.user])
    // console.log([members])
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
    let queryUpdateAtt = ''
    if ( req.params.att === 'kappas'){
        queryUpdateAtt = `UPDATE guzTwitchMembers SET kappa = kappa + 1, kappaMes = kappaMes +1 WHERE username = '${req.params.member}'`
    } else {
        queryUpdateAtt = `UPDATE guzTwitchMembers SET ${req.params.att} = ${req.params.att} ${operator} ${n} WHERE username = '${req.params.member}'`

    }
    console.log(queryUpdateAtt)
    conn.query(queryUpdateAtt)
    .then(() => res.json({'msg': 'foi'}))
    .catch((e) => res.status(500).json({'e': e}))
});

function primeiroPedido(palavra, length){
    if(palavra.length > length){
        return palavra.substring(0, length)
    } else {
        const diff = length - palavra.length
        return palavra + palavra.charAt(palavra.length - 1).repeat(diff)
    }
}

function primeiraMetade(palavra){
    return palavra.substring(0, Math.floor(palavra.length/2))
}

function segundaMetade(palavra){
    return palavra.substring(Math.floor(palavra.length/2), palavra.length)
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function segundoPedido(palavra, nome){
    const _primeiroPedido = primeiroPedido(palavra, nome.length)
    const primeiraParte = _primeiroPedido.substring(0, _primeiroPedido.length - segundaMetade(nome).length)
    console.log(primeiraParte)
    console.log(segundaMetade(nome))
    return primeiraParte + segundaMetade(nome)
}

router.get('/genio/:palavra', function (req, res){
    const palavra = req.params.palavra;
    const charQtd = palavra.length;

    res.json({
        'msg':
        `GÊNIO: você tem 3 desejos \n\n${capitalizeFirstLetter(palavra)}: faça que todas as palavras tenham ${charQtd} letras \n\n${capitalizeFirstLetter(primeiroPedido('Gênio', charQtd))}: ${primeiroPedido('Okay', charQtd)} \n\n${capitalizeFirstLetter(palavra)}: ${primeiroPedido('faça', charQtd)} ${primeiroPedido('todas', charQtd)} ${primeiroPedido('as', charQtd)} ${primeiroPedido('palavras', charQtd)} ${primeiroPedido('terem', charQtd)} ${segundaMetade(palavra).toUpperCase()} ${primeiroPedido('no', charQtd)} ${primeiroPedido('final', charQtd)} \n\n${capitalizeFirstLetter(segundoPedido('Gênio', palavra))}: ${segundoPedido('ok', palavra)} \n\n${capitalizeFirstLetter(palavra)}: ${segundoPedido('faça', palavra)} ${segundoPedido('todas', palavra)} ${segundoPedido('as', palavra)} ${segundoPedido('palavras', palavra)} ${segundoPedido('com', palavra)} ${primeiraMetade(palavra).toUpperCase()} ${segundoPedido('no', palavra)} ${segundoPedido('começo', palavra)} \n\n${capitalizeFirstLetter(palavra)}: ${capitalizeFirstLetter(palavra)} \n\n${capitalizeFirstLetter(palavra)}: ${capitalizeFirstLetter(palavra)}`
    })




})

module.exports = router