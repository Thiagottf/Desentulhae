import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const Salvos = () => {
const navigate = useNavigate()
const [savedPosts, setSavedPosts] = useState([])

useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!loggedUser) {
    alert("Você precisa estar logado para acessar os anúncios salvos.")
    navigate("/")
    return
    }
    const salvosKey = `salvos_${loggedUser.email}`
    const savedIds = JSON.parse(localStorage.getItem(salvosKey)) || []
    const allPosts = JSON.parse(localStorage.getItem("posts")) || []
    const saved = allPosts.filter(post => savedIds.includes(post.id))
    setSavedPosts(saved)
}, [navigate])

return (
    <div className="min-h-screen bg-gray-100 p-4">
    <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Anúncios Salvos
    </h1>
    {savedPosts.length === 0 ? (
        <p className="text-center text-gray-600">Você não salvou nenhum anúncio.</p>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {savedPosts.map(post => (
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
)
}

export default Salvos
