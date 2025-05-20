// src/controllers/entulhoController.js
const db = require('../config/db')

exports.index = async (req, res, next) => {
  try {
    const entulho = await db('entulho').select('*')
    res.json(entulho)
  } catch (err) {
    next(err)
  }
}

exports.show = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    // Busca o entulho principal
    const entulho = await db('entulho')
      .where({ id })
      .first()

    if (!entulho) {
      return res.status(404).json({ error: 'Entulho não encontrado' })
    }

    // Busca as imagens associadas
    const imagens = await db('imagem_entulho')
      .where({ entulho_id: id })
      .pluck('imagem_url')

    // Adiciona as imagens ao objeto entulho
    entulho.imagens = imagens

    res.json(entulho)
  } catch (err) {
    console.error('Erro ao buscar entulho:', err)
    next(err)
  }
}


exports.create = async (req, res, next) => {
  try {
    const {
      titulo,
      descricao,
      localizacao,
      latitude,
      longitude,
      categoria,       // string (id)
      detalhesTipo,
      volume: vStr,
      preco: pStr,
      transacao,
      imagens          // base64 array
    } = req.body

    const cpf_autor = req.user.cpf

    const latitudeNum   = latitude  ? Number(latitude)  : null
    const longitudeNum  = longitude ? Number(longitude) : null
    const volume        = vStr       ? Number(vStr)      : null
    const preco         = pStr       ? Number(pStr)      : null
    const categoria_id  = categoria  ? Number(categoria) : null
    const detalhes_tipo = detalhesTipo || null

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
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*')

    // Salva imagens na tabela imagem_entulho
    if (Array.isArray(imagens) && imagens.length) {
      const imagensParaInserir = imagens.map(img => ({
        entulho_id: novo.id,
        imagem_url: img
      }))
      await db('imagem_entulho').insert(imagensParaInserir)
    }

    res.status(201).json(novo)
  } catch (err) {
    console.error('Erro ao criar entulho:', err)
    next(err)
  }
}


exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
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
      transacao
    } = req.body

    const latitudeNum   = latitude  ? Number(latitude)  : null
    const longitudeNum  = longitude ? Number(longitude) : null
    const volume        = vStr       ? Number(vStr)      : null
    const preco         = pStr       ? Number(pStr)      : null
    const categoria_id  = categoria  ? Number(categoria) : null
    const detalhes_tipo = detalhesTipo || null

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
        updated_at: new Date()
      })
      .returning('*')

    if (!updated) return res.status(404).json({ error: 'Entulho não encontrado' })
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const count = await db('entulho').where({ id }).del()
    if (count === 0) return res.status(404).json({ error: 'Entulho não encontrado' })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
