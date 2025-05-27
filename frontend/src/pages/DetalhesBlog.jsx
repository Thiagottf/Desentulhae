import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const DetalhesBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/blog/${id}`);
        setPost(data);
      } catch (err) {
        console.error("Erro ao carregar post do blog", err);
        setError("Post não encontrado.");
        setTimeout(() => navigate("/blog"), 2000);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) {
    return <p className="text-center mt-10">Carregando post...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Voltar
      </button>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      {post.excerpt && (
        <p className="text-gray-600 italic mb-4">{post.excerpt}</p>
      )}

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

        <p className="text-gray-700 mb-4 whitespace-pre-line">
          {post.content}
        </p>

      <p className="text-gray-500 text-sm">
        Publicado em: {new Date(post.created_at).toLocaleString()}
      </p>
    </div>
  );
};

export default DetalhesBlog;
