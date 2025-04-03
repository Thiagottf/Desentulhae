import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PublicarBlog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
    const newPost = {
      ...form,
      date: new Date().toISOString(),
    };
    localStorage.setItem("blogPosts", JSON.stringify([...blogPosts, newPost]));
    alert("Post publicado com sucesso!");
    navigate("/blog");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Voltar
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center">Publicar no Blog</h1>
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
              className="w-full p-3 rounded border border-gray-300 focus:outline-none"
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
              className="w-full p-3 rounded border border-gray-300 focus:outline-none"
            ></textarea>
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
              className="w-full p-3 rounded border border-gray-300 focus:outline-none"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Imagem (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 focus:outline-none"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicarBlog;
