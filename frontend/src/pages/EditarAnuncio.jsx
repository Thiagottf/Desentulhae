import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditarAnuncio = () => {
const { id } = useParams();
const navigate = useNavigate();

const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    contato: "",
    categoria: "",
    preco: "",
    volume: "",
    detalhesTipo: "",
    transacao: "",
    imagens: [],
    latitude: null,
    longitude: null,
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    (async () => {
    setLoading(true);
    try {
        const { data } = await api.get(`/entulhos/${id}`);
        setForm(data);
    } catch (err) {
        console.error("Erro ao carregar anúncio", err);
        setError("Anúncio não encontrado.");
        setTimeout(() => navigate("/painelusuario"), 2000);
    } finally {
        setLoading(false);
    }
    })();
}, [id, navigate]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
};

const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
    Promise.all(
        files.map(file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject("Erro ao ler arquivo");
            reader.readAsDataURL(file);
        })
        )
    )
        .then(results => setForm(prev => ({ ...prev, imagens: results })))
        .catch(() => setError("Erro ao processar as imagens."));
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
    await api.put(`/entulhos/${id}`, form);
    navigate("/painelusuario");
    } catch (err) {
    console.error("Erro ao salvar alterações", err);
    setError("Falha ao atualizar anúncio.");
    } finally {
    setLoading(false);
    }
};

const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esse anúncio?")) return;
    try {
    await api.delete(`/entulhos/${id}`);
    navigate("/painelusuario");
    } catch (err) {
    console.error("Erro ao excluir anúncio", err);
    setError("Falha ao excluir anúncio.");
    }
};

if (loading) {
    return <p className="text-center mt-10">Carregando anúncio...</p>;
}

return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-600 to-lime-500 p-4">
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-8 shadow-lg">
        <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
        Voltar
        </button>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <h1 className="text-3xl font-bold text-center mb-6">Editar Anúncio</h1>
        <form onSubmit={handleSubmit}>
          {/* Campos do formulário, iguais aos de PublicarEntulho.jsx, mas controlados por form */}
        <div className="mb-4">
            <label className="block mb-1">Título</label>
            <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">Descrição</label>
            <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">Localização</label>
            <input
            type="text"
            name="localizacao"
            value={form.localizacao}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">Contato</label>
            <input
            type="text"
            name="contato"
            value={form.contato}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
            <label className="block mb-1">Categoria</label>
            <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-transparent border border-white/30 text-black focus:outline-none"
            >
                <option value="">Selecione</option>
                <option value="A">Classe A</option>
                <option value="B">Classe B</option>
                <option value="C">Classe C</option>
                <option value="D">Classe D</option>
            </select>
            </div>
            <div>
            <label className="block mb-1">Transação</label>
            <select
                name="transacao"
                value={form.transacao}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-transparent border border-white/30 text-black focus:outline-none"
            >
                <option value="">Selecione</option>
                <option value="venda">Venda</option>
                <option value="doacao">Doação</option>
            </select>
            </div>
        </div>
        {form.transacao === "venda" && (
            <div className="mb-4 flex items-center">
            <span className="px-3 bg-transparent text-white">R$</span>
            <input
                type="text"
                name="preco"
                value={form.preco}
                onChange={handleChange}
                required
                className="flex-1 p-3 rounded-r-lg border border-white/30 placeholder-white text-white focus:outline-none"
            />
            </div>
        )}
        <div className="mb-4">
            <label className="block mb-1">Volume</label>
            <input
            type="text"
            name="volume"
            value={form.volume}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">Detalhes do Tipo</label>
            <textarea
            name="detalhesTipo"
            value={form.detalhesTipo}
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2 font-semibold">Imagens (mínimo 4)</label>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full p-2 bg-transparent border border-white/30 text-white focus:outline-none"
            />
            {form.imagens?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {form.imagens.map((src, index) => (
                    <img
                    key={index}
                    src={src}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-white/20"
                    />
                ))}
                </div>
            )}
            </div>
        <div className="flex justify-between">
            <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
            Excluir
            </button>
            <button
            type="submit"
            className="bg-white text-green-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
            >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default EditarAnuncio;
