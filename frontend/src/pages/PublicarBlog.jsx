import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PublicarBlog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/blog", form);
      alert("Post publicado com sucesso!");
      navigate("/blog");
    } catch (err) {
      console.error("Erro ao publicar post:", err);
      setError("Erro ao publicar post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-accent p-4">
      <div className="w-full max-w-2xl bg-white border border-black/20 text-black rounded-xl p-8 shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-secondary text-white px-4 py-2 rounded hover:brightness-90 transition"
        >
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-center mb-6">Publicar no Blog</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Digite o título do post"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Resumo</label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              required
              placeholder="Digite um resumo para o post"
              rows="2"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Conteúdo</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              placeholder="Digite o conteúdo completo do post"
              rows="6"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Imagem (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-black/30 focus:outline-none"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded border border-black/20"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2 rounded-full hover:brightness-90 transition"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicarBlog;
