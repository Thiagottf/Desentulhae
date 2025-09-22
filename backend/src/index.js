// src/index.js
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

// ===== Configuração do CORS =====
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173"
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite se for o frontend ou se for requisição sem origin (ex: Postman)
      if (!origin || origin === allowedOrigin) {
        callback(null, true)
      } else {
        callback(new Error("CORS bloqueado para essa origem"))
      }
    },
    credentials: true,
  })
)

// ===== Configuração de body parsers =====
app.use(express.json({ limit: "20mb" }))
app.use(express.urlencoded({ limit: "20mb", extended: true }))

// ===== Rotas =====
app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/entulhos", require("./routes/entulhos"))
app.use("/api/blog", require("./routes/blog"))
app.use("/api/reports", require("./routes/lostReport"))
app.use("/api/conversas", require("./routes/chat"))
app.use("/api/notificacoes", require("./routes/notification"))

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" })
})

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error("❌ Erro no servidor:", err.stack)
  res.status(500).json({ error: "Erro interno do servidor" })
})

// ===== Inicialização =====
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`🚀 Server rodando na porta ${port}`)
  console.log(`🌍 Origem permitida: ${allowedOrigin}`)
})
