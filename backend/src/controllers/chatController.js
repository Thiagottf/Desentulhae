const db = require('../config/db');

// 🔁 Lista as mensagens do chat
exports.list = async (req, res, next) => {
  try {
    const entulho_id = Number(req.params.entulhoId);
    if (isNaN(entulho_id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const mensagens = await db('chat_message')
      .where({ entulho_id })
      .orderBy('enviado_em', 'asc');

    return res.json(mensagens); // ✅ mesmo se vazio, retorna []
  } catch (err) {
    next(err);
  }
};

// 📨 Envia uma nova mensagem
exports.send = async (req, res, next) => {
  try {
    const entulho_id = Number(req.params.entulhoId);
    if (isNaN(entulho_id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Mensagem vazia." });
    }

    const sender = req.user.email; // ou req.user.cpf

    await db('chat_message').insert({
      entulho_id,
      remetente_cpf: req.user.cpf,
      texto: text,
      enviado_em: new Date()
    });

    const mensagens = await db('chat_message')
      .where({ entulho_id })
      .orderBy('enviado_em', 'asc');

    res.status(201).json(mensagens);
  } catch (err) {
    next(err);
  }
};

exports.listAllForUser = async (req, res, next) => {
  try {
    const cpf = req.user.cpf;

    // 1. Todas mensagens que ele enviou
    const mensagensEnviadas = await db('chat_message')
      .where('remetente_cpf', cpf)
      .select('entulho_id');

    // 2. Todos anúncios que ele criou
    const meusAnuncios = await db('entulho')
      .where('cpf_autor', cpf)
      .select('id as entulho_id');

    // 3. Juntar todos entulho_id envolvidos
    const entulhoIds = new Set([
      ...mensagensEnviadas.map(m => m.entulho_id),
      ...meusAnuncios.map(a => a.entulho_id)
    ]);

    const conversas = await Promise.all(
      Array.from(entulhoIds).map(async (entulhoId) => {
        const anuncio = await db('entulho').where({ id: entulhoId }).first();
        const ultimaMensagem = await db('chat_message')
          .where({ entulho_id: entulhoId })
          .orderBy('enviado_em', 'desc')
          .first();

        return {
          entulhoId,
          titulo: anuncio?.titulo || "Anúncio removido",
          ultimaMensagem: ultimaMensagem ? {
            text: ultimaMensagem.texto,
            timestamp: ultimaMensagem.enviado_em
          } : null
        };
      })
    );

    res.json(conversas);
  } catch (err) {
    next(err);
  }
};