const db = require('../config/db');

const listar = async (req, res, next) => {
  try {
    const notificacoes = await db('notificacao')
      .where({ usuario_cpf: req.user.cpf })
      .orderBy('criado_em', 'desc');
    res.json(notificacoes);
  } catch (err) {
    next(err);
  }
};

const marcarComoLida = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db('notificacao')
      .where({ id, usuario_cpf: req.user.cpf })
      .update({ lida: true });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const criar = async ({ usuario_cpf, mensagem, entulho_id }) => {
  return db('notificacao').insert({
    usuario_cpf,
    mensagem,
    entulho_id,
    lida: false,
    criado_em: new Date()
  });
};


module.exports = {
  listar,
  marcarComoLida,
  criar
};
