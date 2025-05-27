import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const PainelUsuario = () => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const { data } = await api.get('/users/me/entulhos');
        setUserPosts(data);
      } catch (err) {
        console.error('Erro ao carregar anúncios do usuário', err);
        setError('Não foi possível carregar seus anúncios.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Tem certeza que deseja excluir esse anúncio?')) return;
    try {
      await api.delete(`/entulhos/${postId}`);
      setUserPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Erro ao excluir anúncio', err);
      setError('Falha ao excluir anúncio.');
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando seus anúncios...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Meus Anúncios</h1>
      {userPosts.length === 0 ? (
        <p className="text-center text-gray-600">Você não publicou nenhum anúncio.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded shadow flex flex-col transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2">{post.titulo}</h2>

              {post.imagens && post.imagens.length > 0 ? (
                <img
                  src={post.imagens[0]}
                  alt={post.titulo}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-500">
                  Sem imagem
                </div>
              )}

              <p className="text-gray-600 mb-2 flex-1">{post.localizacao}</p>

              <p className="text-gray-500 text-sm mb-1">
                Publicado em:{" "}
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "Data não disponível"}
              </p>

              <p className="text-gray-800 font-medium">
                Tipo: {post.categoria
                  ? `Classe ${post.categoria} – ${post.categoria_descricao}`
                  : "Não informada"}
              </p>

              <details className="mt-4 w-full">
  <summary className="cursor-pointer text-sm text-gray-700 hover:text-black">
    ⚙️ Ações
  </summary>
  <div className="mt-2 flex flex-col gap-1 text-sm pl-2">
    <Link to={`/detalhes/${post.id}`} className="text-blue-600 hover:underline">
      🔍 Visualizar
    </Link>
    <button
      onClick={() => navigate(`/editar/${post.id}`)}
      className="text-green-600 hover:underline text-left"
    >
      ✏️ Editar
    </button>
    <button
      onClick={() => handleDelete(post.id)}
      className="text-red-600 hover:underline text-left"
    >
      🗑️ Excluir
    </button>
    <Link to={`/mensagens/${post.id}`} className="text-purple-600 hover:underline">
      💬 Conversas
    </Link>
  </div>
</details>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PainelUsuario;
