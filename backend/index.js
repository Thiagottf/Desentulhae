// backend/server.js
require('dotenv').config()
const express = require('express')
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development'])
const app = express()

app.use(express.json())

// Middleware de CORS (se precisar)
const cors = require('cors')
app.use(cors())

// Conexão Knex em req.db
app.use((req, _, next) => {
  req.db = knex
  next()
})

// Rotas
const authRoutes = require('./routes/auth')
const entulhoRoutes = require('./routes/entulho')
const blogRoutes = require('./routes/blog')

app.use('/auth', authRoutes)
app.use('/entulhos', entulhoRoutes)
app.use('/blog', blogRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`))
