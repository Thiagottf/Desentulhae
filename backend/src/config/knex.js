require('dotenv').config();
const knex = require('knex');

console.log('🔍 Conectando com as variáveis:');
console.log({
  PG_HOST: process.env.PG_HOST,
  PG_PORT: process.env.PG_PORT,
  PG_USER: process.env.PG_USER,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_DATABASE: process.env.PG_DATABASE,
});

const config = {
  client: 'pg',
  connection: {
    host     : process.env.PG_HOST,
    port     : process.env.PG_PORT,
    user     : process.env.PG_USER,
    password : process.env.PG_PASSWORD,
    database : process.env.PG_DATABASE,
    ssl      : { rejectUnauthorized: false }
  },
  migrations: { directory: './migrations' },
  seeds:     { directory: './seeds' },
};

module.exports = knex(config);
