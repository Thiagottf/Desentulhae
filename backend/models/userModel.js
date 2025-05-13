// backend/models/userModel.js
const knex = require('../config/config')

module.exports = {
  create(user) {
    return knex('usuario').insert(user)
  },

  findByEmail(email) {
    return knex('usuario').where({ email }).first()
  },

  findByCpf(cpf) {
    return knex('usuario').where({ cpf }).first()
  }
}
