const mysql = require('mysql2/promise'); 
const config = require('../../config/mysql-config');

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const connection = mysql.createConnection(config.db);

    global.connection = connection;

    return connection;
}

async function query(sql, params) {
    const conn = await connect();
  
    const [results, ] = await conn.execute(sql, params);

    return results;
}

module.exports = {
    query
  }