// backend/controllers/chatController.js
const knex = require('../config/config')

module.exports = {
  async list(req, res, next) {
    try {
      const { entulhoId } = req.params
      const messages = await knex('chat_message')
        .where({ entulho_id: entulhoId })
        .orderBy('enviado_em')
      res.json(messages)
    } catch(err){ next(err) }
  },

  async send(req, res, next) {
    try {
      const { entulhoId } = req.params
      const remetente_cpf = req.user.cpf
      const { texto } = req.body
      const [msg] = await knex('chat_message')
        .insert({ entulho_id: entulhoId, remetente_cpf, texto })
        .returning('*')
      res.status(201).json(msg)
    } catch(err){ next(err) }
  }
}
