import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DetalhesBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const blogPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
    const postIndex = Number(id);
    if (blogPosts && blogPosts.length > postIndex) {
      setPost(blogPosts[postIndex]);
    } else {
      alert("Post não encontrado.");
      navigate("/blog");
    }
  }, [id, navigate]);

  if (!post) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Voltar
      </button>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-gray-500 text-sm">
        Publicado em: {new Date(post.date).toLocaleString()}
      </p>
    </div>
  );
};

export default DetalhesBlog;
