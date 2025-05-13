// backend/routes/entulho.js
const router = require('express').Router()

// GET /entulhos
router.get('/', async (req, res) => {
  try {
    const items = await req.db('entulho')
      .select('id','titulo','descricao','localizacao','preco','transacao','created_at')
      .orderBy('created_at','desc')
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar entulhos' })
  }
})

module.exports = router
