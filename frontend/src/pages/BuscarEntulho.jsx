import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const BuscarEntulho = () => {
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [keyword, setKeyword] = useState("");
const [categoria, setCategoria] = useState("");
const [localizacao, setLocalizacao] = useState("");
const [dataPublicacao, setDataPublicacao] = useState("");
const [sortOrder, setSortOrder] = useState("desc");
const [currentPage, setCurrentPage] = useState(1);
const postsPerPage = 6;

  // Fetch entulhos
useEffect(() => {
    (async () => {
    setLoading(true);
    try {
        const { data } = await api.get("/entulhos");
        setPosts(data);
    } catch (err) {
        console.error("Erro ao buscar entulhos", err);
        setError("Não foi possível carregar os entulhos.");
    } finally {
        setLoading(false);
    }
    })();
}, []);

  // Filter and sort
const filteredPosts = posts
    .filter((post) => {
    if (keyword) {
        const term = keyword.toLowerCase();
        if (!post.titulo.toLowerCase().includes(term) && !post.descricao.toLowerCase().includes(term)) {
        return false;
        }
    }
    if (categoria && post.categoria !== categoria) return false;
    if (localizacao && !post.localizacao.toLowerCase().includes(localizacao.toLowerCase())) return false;
    if (dataPublicacao) {
        if (!post.dataPublicacao) return false;
        const postDate = new Date(post.dataPublicacao).toISOString().slice(0, 10);
        if (postDate !== dataPublicacao) return false;
    }
    return true;
    })
    .sort((a, b) => {
    if (!a.dataPublicacao || !b.dataPublicacao) return 0;
    return sortOrder === "desc"
        ? new Date(b.dataPublicacao) - new Date(a.dataPublicacao)
        : new Date(a.dataPublicacao) - new Date(b.dataPublicacao);
    });

  // Pagination logic
const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

if (loading) {
    return <p className="text-center mt-10">Carregando entulhos...</p>;
}
if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
}

return (
    <div className="min-h-screen bg-gray-100 p-4">
    <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Buscar Entulho
    </h1>
    <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
            type="text"
            placeholder="Buscar por palavra-chave..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-2 border rounded"
        />
        <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="p-2 border rounded text-black"
        >
            <option value="">Todos os Tipos</option>
            <option value="A">Classe A</option>
            <option value="B">Classe B</option>
            <option value="C">Classe C</option>
            <option value="D">Classe D</option>
        </select>
        <input
            type="text"
            placeholder="Localização (bairro, cidade ou CEP)"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            className="p-2 border rounded"
        />
        <input
            type="date"
            value={dataPublicacao}
            onChange={(e) => setDataPublicacao(e.target.value)}
            className="p-2 border rounded"
        />
        </div>
        <div className="mt-4 flex items-center justify-between">
        <div>
            <label className="mr-2">Ordenar por data:</label>
            <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded text-black"
            >
            <option value="desc">Mais recentes</option>
            <option value="asc">Mais antigas</option>
            </select>
        </div>
        <button
            onClick={() => {
            setKeyword("");
            setCategoria("");
            setLocalizacao("");
            setDataPublicacao("");
            setSortOrder("desc");
            setCurrentPage(1);
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
            Limpar Filtros
        </button>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {currentPosts.length > 0 ? (
        currentPosts.map((post) => (
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
        ))
        ) : (
        <p className="text-center col-span-full text-gray-600">
            Nenhum resultado encontrado.
        </p>
        )}
    </div>

    {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
        <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
        >
            Anterior
        </button>
        <span>
            Página {currentPage} de {totalPages}
        </span>
        <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
        >
            Próxima
        </button>
        </div>
    )}
    </div>
);
};

export default BuscarEntulho;
