const mysql = require('mysql2/promise');
require('dotenv').config();

async function connect(){ 
    const connection = await mysql.createConnection(process.env.DATABASE_URL)
    console.log('conectou')
    return connection
}

module.exports = {
    connect: connect
}