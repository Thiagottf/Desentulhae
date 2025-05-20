import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Salvos = () => {
const navigate = useNavigate();
const [savedPosts, setSavedPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    (async () => {
    setLoading(true);
    try {
        // Verifica token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
        navigate('/login');
        return;
        }
        const { data } = await api.get('/usuarios/me/salvos');
        setSavedPosts(data);
    } catch (err) {
        console.error('Erro ao carregar anúncios salvos', err);
        setError('Não foi possível carregar os anúncios salvos.');
    } finally {
        setLoading(false);
    }
    })();
}, [navigate]);

if (loading) {
    return <p className="text-center mt-10">Carregando anúncios salvos...</p>;
}

if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
}

return (
    <div className="min-h-screen bg-gray-100 p-4">
    <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Anúncios Salvos
    </h1>
    {savedPosts.length === 0 ? (
        <p className="text-center text-gray-600">Você não salvou nenhum anúncio.</p>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {savedPosts.map((post) => (
            <Link to={`/detalhes/${post.id}`} key={post.id} className="block">
            <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition transform hover:scale-105 hover:shadow-lg">
                {post.imagens && post.imagens.length > 0 ? (
                <img
                    src={post.imagens[0]}
                    alt={post.titulo}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                ) : (
                <div className="w-full h-48 bg-gray-300 rounded-t-lg mb-4 flex items-center justify-center">
                    Sem Imagem
                </div>
                )}
                <h2 className="text-xl font-semibold mb-2">{post.titulo}</h2>
                <p className="text-gray-600 mb-2">{post.localizacao}</p>
                <p className="text-gray-800 font-medium">Tipo: {post.categoria}</p>
            </div>
            </Link>
        ))}
        </div>
    )}
    </div>
);
};

export default Salvos;
