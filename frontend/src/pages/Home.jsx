import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Home = () => {
  const [posts, setPosts] = useState([])

useEffect(() => {
    const postsData = JSON.parse(localStorage.getItem("posts")) || []
    setPosts(postsData)
}, [])

return (
    <div className="min-h-screen bg-gray-100 p-4">
    

    {posts.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum entulho publicado ainda.</p>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
            <Link to={`/detalhes/${post.id}`} key={post.id} className="block">
            <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition transform hover:scale-105 hover:shadow-lg">
                {post.imagens && post.imagens.length > 0 ? (
                <img
                    src={post.imagens[0]}
                    alt={post.titulo}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                ) : post.imagem ? (
                <img
                    src={post.imagem}
                    alt={post.titulo}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                ) : null}

                <h2 className="text-xl font-semibold mb-2">{post.titulo}</h2>
                <p className="text-gray-600 mb-2">
                {post.descricao.length > 100
                    ? post.descricao.substring(0, 100) + "..."
                    : post.descricao}
                </p>
                <div className="flex justify-between items-center text-gray-800 font-medium">
                <span>{post.localizacao}</span>
                <span>{post.contato}</span>
                </div>
            </div>
            </Link>
        ))}
        </div>
    )}
    </div>
)
}

export default Home
