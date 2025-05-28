const db = require("../config/knex")

exports.index = async (req, res, next) => {
  try {
    const posts = await db("blog_post")
  .select("id", "title", "excerpt", "image_url", "created_at", "autor_cpf")
  .orderBy("created_at", "desc");
  
    res.json(posts);
  } catch (err) {
    next(err);
  }
};


exports.show = async (req, res, next) => {
  try {
    const post = await db("blog_post")
  .select("*")
  .where("id", req.params.id)
  .first();


    if (!post) return res.status(404).json({ error: "Post não encontrado." });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, excerpt, content, image } = req.body;
    const cpf = req.user?.cpf;

    if (!cpf) return res.status(401).json({ error: "Usuário não autenticado" });

    const [id] = await db("blog_post")
      .insert({
        autor_cpf: cpf,
        title,
        excerpt,
        content,
        image_url: image,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("id");

    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { title, excerpt, content, image } = req.body;
    const { id } = req.params;
    const cpf = req.user?.cpf;

    const post = await db("blog_post").where({ id }).first();
    if (!post) return res.status(404).json({ error: "Post não encontrado." });

    if (post.autor_cpf !== cpf) {
      return res.status(403).json({ error: "Você não tem permissão para editar este post." });
    }

    await db("blog_post")
      .where({ id })
      .update({
        title,
        excerpt,
        content,
        image_url: image,
        updated_at: new Date(),
      });

    res.json({ message: "Post atualizado com sucesso." });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cpf = req.user?.cpf;

    const post = await db("blog_post").where({ id }).first();
    if (!post) return res.status(404).json({ error: "Post não encontrado." });

    if (post.autor_cpf !== cpf) {
      return res.status(403).json({ error: "Você não tem permissão para excluir este post." });
    }

    await db("blog_post").where({ id }).del();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};