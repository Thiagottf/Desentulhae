// src/index.js
require('dotenv').config()
const express = require('express')
const app = express()

// middleware para JSON
app.use(express.json())

// importar rotas
const authRoutes    = require('./routes/auth')
const userRoutes    = require('./routes/users')
const entulhoRoutes = require('./routes/entulhos')
const blogRoutes    = require('./routes/blog')
const reportRoutes  = require('./routes/lostReport')
const chatRoutes    = require('./routes/chat')
const notifRoutes   = require('./routes/notification')

// montar rotas (prefixo /api para todas elas)
app.use('/api/auth',         authRoutes)
app.use('/api/users',        userRoutes)
app.use('/api/entulhos',     entulhoRoutes)
app.use('/api/blog',         blogRoutes)
app.use('/api/reports',      reportRoutes)
app.use('/api/chat',         chatRoutes)
app.use('/api/notificacoes', notifRoutes)

// 404 fallback
app.use((req, res) => {
res.status(404).json({ error: 'Rota não encontrada' })
})

const port = process.env.PORT || 4000
app.listen(port, () =>
console.log(`🚀 Server rodando em http://localhost:${port}`)
)
