import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const EditarAnuncio = () => {
const { id } = useParams()
const navigate = useNavigate()
const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    contato: "",
    categoria: "",
    imagens: []
})

useEffect(() => {
    const posts = JSON.parse(localStorage.getItem("posts")) || []
    const anuncio = posts.find(post => post.id === Number(id))
    if (!anuncio) {
    alert("Anúncio não encontrado.")
    navigate("/painel")
    } else {
    setForm(anuncio)
    }
}, [id, navigate])

const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
}

const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    // Se o usuário escolher novos arquivos, atualizamos as imagens
    if (files.length > 0) {
    const promises = files.map(file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = () => reject("Erro ao ler o arquivo")
        reader.readAsDataURL(file)
    }))
    Promise.all(promises)
        .then(results => {
        setForm(prev => ({ ...prev, imagens: results }))
        })
        .catch(() => {
        alert("Erro ao processar as imagens.")
        })
    }
}

const handleSubmit = (e) => {
    e.preventDefault()
    const posts = JSON.parse(localStorage.getItem("posts")) || []
    const updatedPosts = posts.map(post => {
    if (post.id === Number(id)) {
        return { ...form }
    }
    return post
    })
    localStorage.setItem("posts", JSON.stringify(updatedPosts))
    alert("Anúncio atualizado com sucesso!")
    navigate("/painel")
}

const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esse anúncio?")) {
    const posts = JSON.parse(localStorage.getItem("posts")) || []
    const updatedPosts = posts.filter(post => post.id !== Number(id))
    localStorage.setItem("posts", JSON.stringify(updatedPosts))
    alert("Anúncio excluído com sucesso!")
    navigate("/painel")
    }
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
        <h1 className="text-3xl font-bold text-center mb-6">Editar Anúncio</h1>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label className="block mb-1">Título</label>
            <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
            placeholder="Digite o título do anúncio"
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
            placeholder="Descreva os detalhes do entulho"
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            rows="4"
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
            placeholder="Digite a localização"
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">Contato (Telefone/WhatsApp)</label>
            <input
            type="text"
            name="contato"
            value={form.contato}
            onChange={handleChange}
            required
            placeholder="Digite seu contato"
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">Tipo de Entulho</label>
            <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-transparent border border-white/30 text-black focus:outline-none"
            >
            <option value="">Selecione uma categoria</option>
            <option value="A">Classe A - Alvenarias, concreto, argamassas e solos</option>
            <option value="B">Classe B - Madeira, metal, plástico, papel, vidro</option>
            <option value="C">Classe C - Resíduos sem tecnologia para reciclagem (gesso, isopor)</option>
            <option value="D">Classe D - Resíduos perigosos (tintas, solventes, óleos, etc.)</option>
            </select>
        </div>
        <div className="mb-4">
            <label className="block mb-1">Imagens (mínimo 4)</label>
            <input
            type="file"
            name="imagens"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 bg-transparent border border-white/30 text-white focus:outline-none"
            />
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
            Salvar Alterações
            </button>
        </div>
        </form>
    </div>
    </div>
)
}

export default EditarAnuncio
