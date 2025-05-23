// src/controllers/entulhoController.js
const db = require('../config/db');

exports.index = async (req, res, next) => {
  try {
    const entulhos = await db('entulho')
      .leftJoin('categoria_entulho', 'entulho.categoria_id', 'categoria_entulho.id')
      .select(
        'entulho.*',
        'categoria_entulho.classificacao as categoria',
        'categoria_entulho.descricao as categoria_descricao'
      )
      .orderBy('entulho.created_at', 'desc');

    for (let entulho of entulhos) {
      const imagens = await db('imagem_entulho')
        .where({ entulho_id: entulho.id })
        .pluck('imagem_url');
      entulho.imagens = imagens;
    }

    res.json(entulhos);
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const entulho = await db('entulho')
      .leftJoin('categoria_entulho', 'entulho.categoria_id', 'categoria_entulho.id')
      .select(
        'entulho.*',
        'categoria_entulho.classificacao as categoria',
        'categoria_entulho.descricao as categoria_descricao'
      )
      .where('entulho.id', id)
      .first();

    if (!entulho) {
      return res.status(404).json({ error: 'Entulho não encontrado' });
    }

    const imagens = await db('imagem_entulho')
      .where({ entulho_id: id })
      .pluck('imagem_url');

    entulho.imagens = imagens;

    res.json(entulho);
  } catch (err) {
    console.error('Erro ao buscar entulho:', err);
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      titulo,
      descricao,
      localizacao,
      latitude,
      longitude,
      categoria,
      detalhesTipo,
      volume: vStr,
      preco: pStr,
      transacao,
      imagens,
      contato
    } = req.body;

    const cpf_autor = req.user.cpf;

    const latitudeNum   = latitude  ? Number(latitude)  : null;
    const longitudeNum  = longitude ? Number(longitude) : null;
    const volume        = vStr       ? Number(vStr)      : null;
    const preco         = pStr       ? Number(pStr)      : null;
    const categoria_id  = categoria  ? Number(categoria) : null;
    const detalhes_tipo = detalhesTipo || null;

    const [novo] = await db('entulho')
      .insert({
        cpf_autor,
        titulo,
        descricao,
        localizacao,
        latitude: latitudeNum,
        longitude: longitudeNum,
        categoria_id,
        detalhes_tipo,
        volume,
        preco,
        transacao,
        contato,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    if (Array.isArray(imagens) && imagens.length) {
      const imagensParaInserir = imagens.map(img => ({
        entulho_id: novo.id,
        imagem_url: img
      }));
      await db('imagem_entulho').insert(imagensParaInserir);
    }

    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar entulho:', err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const {
      titulo,
      descricao,
      localizacao,
      latitude,
      longitude,
      categoria,
      detalhesTipo,
      volume: vStr,
      preco: pStr,
      transacao,
      imagens,
      contato
    } = req.body;

    const latitudeNum   = latitude  ? Number(latitude)  : null;
    const longitudeNum  = longitude ? Number(longitude) : null;
    const volume        = vStr       ? Number(vStr)      : null;
    const preco         = pStr       ? Number(pStr)      : null;
    const categoria_id  = categoria  ? Number(categoria) : null;
    const detalhes_tipo = detalhesTipo || null;

    const [updated] = await db('entulho')
      .where({ id })
      .update({
        titulo,
        descricao,
        localizacao,
        latitude: latitudeNum,
        longitude: longitudeNum,
        categoria_id,
        detalhes_tipo,
        volume,
        preco,
        transacao,
        contato,
        updated_at: new Date()
      })
      .returning('*');

    if (!updated) return res.status(404).json({ error: 'Entulho não encontrado' });

    if (Array.isArray(imagens) && imagens.length > 0) {
      await db('imagem_entulho').where({ entulho_id: id }).del();
      const novasImagens = imagens.map((img) => ({
        entulho_id: id,
        imagem_url: img
      }));
      await db('imagem_entulho').insert(novasImagens);
    }

    res.json(updated);
  } catch (err) {
    console.error('Erro ao atualizar entulho:', err);
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const entulho = await db('entulho').where({ id }).first();
    if (!entulho) {
      return res.status(404).json({ error: 'Entulho não encontrado' });
    }

    await db('entulho').where({ id }).del();

    res.status(204).end();
  } catch (err) {
    console.error('Erro ao remover entulho:', err);
    next(err);
  }
};

exports.solicitar = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const entulho = await db('entulho').where({ id }).first();
    if (!entulho) {
      return res.status(404).json({ error: 'Entulho não encontrado' });
    }

    if (entulho.cpf_autor === req.user.cpf) {
      return res.status(400).json({ error: 'Você não pode solicitar seu próprio entulho.' });
    }

    const notificacao = require('./notificationController');
    await notificacao.criar({
      usuario_cpf: entulho.cpf_autor,
      mensagem: `${req.user.apelido} solicitou a ${entulho.transacao} do entulho "${entulho.titulo}"`,
      entulho_id: entulho.id
    });

    res.status(201).json({ message: 'Solicitação enviada com sucesso' });
  } catch (err) {
    console.error('Erro ao solicitar entulho:', err);
    next(err);
  }
};

