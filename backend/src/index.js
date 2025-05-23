// src/index.js
require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const app     = express()

// Habilita CORS para o front (Vite em http://localhost:5173 ou origem definida)
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))

// **Aumenta o limite de JSON / URL-encoded** para suportar payloads grandes (ex.: imagens em base64)
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))

// Rotas
const authRoutes    = require('./routes/auth')
const userRoutes    = require('./routes/users')
const entulhoRoutes = require('./routes/entulhos')
const blogRoutes    = require('./routes/blog')
const reportRoutes  = require('./routes/lostReport')
const chatRoutes    = require('./routes/chat')
const notifRoutes   = require('./routes/notification')

app.use('/api/auth',         authRoutes)
app.use('/api/users',        userRoutes)
app.use('/api/entulhos',     entulhoRoutes)
app.use('/api/blog',         blogRoutes)
app.use('/api/reports',      reportRoutes)
app.use('/api/conversas', chatRoutes)
app.use('/api/notificacoes', notifRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Error handler: captura erros de async/await
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

const port = process.env.PORT || 4000
app.listen(port, () =>
  console.log(`🚀 Server rodando em http://localhost:${port}`)
)
