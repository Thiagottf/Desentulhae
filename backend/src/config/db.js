// backend/src/config/db.js
require('dotenv').config()
const knex = require('knex')({
client: 'pg',
connection: {
    host     : process.env.DB_HOST     || 'localhost',
    port     : process.env.DB_PORT     || 5432,
    user     : process.env.DB_USER     || 'postgres',
    password : process.env.DB_PASSWORD || '123',
    database : process.env.DB_NAME     || 'Desentulhae'
},
pool: { min: 0, max: 10 }
})

module.exports = knex
