const { Pool } = require('pg')
const { PASSWORD } = require('../constants')
const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'pern_auth',
    password: PASSWORD,
    port: 5432
});

module.exports = {
    query: (text, params) => pool.query(text, params)
}