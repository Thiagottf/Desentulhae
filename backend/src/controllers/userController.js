// src/controllers/userController.js
const db = require("../config/knex")

exports.list = async (req, res, next) => {
  try {
    res.json([]) // retornar todos os usuários (stub)
  } catch (err) { next(err) }
}

exports.get = async (req, res, next) => {
  try {
    res.json({ cpf: req.params.cpf }) // detalhes (stub)
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
  try {
    res.json({ message: 'Usuário atualizado (stub)' })
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    res.status(204).end()
  } catch (err) { next(err) }
}

exports.listarEntulhosDoUsuario = async (req, res, next) => {
  try {
    const cpf = req.user.cpf;

    const entulhos = await db('entulho')
      .leftJoin('categoria_entulho', 'entulho.categoria_id', 'categoria_entulho.id')
      .select(
        'entulho.*',
        'categoria_entulho.classificacao as categoria',
        'categoria_entulho.descricao as categoria_descricao'
      )
      .where('entulho.cpf_autor', cpf)
      .orderBy('entulho.created_at', 'desc');

    // adiciona imagens manualmente por entulho
    for (let entulho of entulhos) {
      const imagens = await db('imagem_entulho')
        .where({ entulho_id: entulho.id })
        .pluck('imagem_url');

      entulho.imagens = imagens;
    }

    res.json(entulhos);
  } catch (err) {
    console.error('Erro ao buscar entulhos do usuário:', err);
    next(err);
  }
};

