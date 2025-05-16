// backend/src/config/knex.js
require('dotenv').config();           // carrega .env
const knex = require('knex');
const knexfile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const config = knexfile[env];

module.exports = knex(config);
