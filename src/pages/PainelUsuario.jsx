import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

const PainelUsuario = () => {
  const navigate = useNavigate()
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!loggedUser) {
      alert("Você precisa estar logado para acessar essa página.")
      navigate("/")
      return
    }
    const allPosts = JSON.parse(localStorage.getItem("posts")) || []
    const filteredPosts = allPosts.filter(post => post.usuario === loggedUser.email)
    setUserPosts(filteredPosts)
  }, [navigate])

  const handleDelete = (postId) => {
    if (window.confirm("Tem certeza que deseja excluir esse anúncio?")) {
      const allPosts = JSON.parse(localStorage.getItem("posts")) || []
      const updatedPosts = allPosts.filter(post => post.id !== postId)
      localStorage.setItem("posts", JSON.stringify(updatedPosts))
      const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
      const filteredPosts = updatedPosts.filter(post => post.usuario === loggedUser.email)
      setUserPosts(filteredPosts)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Meus Anúncios</h1>
      {userPosts.length === 0 ? (
        <p className="text-center text-gray-600">Você não publicou nenhum anúncio.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {userPosts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{post.titulo}</h2>
              {post.imagens && post.imagens.length > 0 && (
                <img
                  src={post.imagens[0]}
                  alt={post.titulo}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <p className="text-gray-600 mb-2">{post.localizacao}</p>
              <p className="text-gray-800 font-medium">Tipo: {post.categoria}</p>
              <div className="flex justify-between mt-4">
                <Link to={`/detalhes/${post.id}`} className="text-blue-600 hover:underline">
                  Visualizar
                </Link>
                <button
                  onClick={() => navigate(`/editar/${post.id}`)}
                  className="text-green-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PainelUsuario
