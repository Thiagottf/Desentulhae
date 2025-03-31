import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FaSearch, FaCommentDots, FaBell, FaUserCircle } from "react-icons/fa"
import logo from "../assets/cacambaEntulho.jpg"

const Header = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [loggedUser, setLoggedUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (userData) {
      setLoggedUser(userData)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/buscar?query=${searchTerm}`)
  }

  return (
    <header className="bg-white shadow-md  top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* LOGO E NOME */}
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center">
            <img src={logo} alt="Desentulhaê" className="w-8 h-8 mr-2" />
            <span className="text-xl font-bold text-gray-800">Desentulhaê</span>
          </Link>
        </div>

        {/* BARRA DE BUSCA (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4 max-w-xl">
          <input
            type="text"
            placeholder="Buscar em Desentulhaê"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700 transition"
          >
            <FaSearch />
          </button>
        </form>

        {/* LINKS E AÇÕES */}
        <div className="flex items-center gap-4">
          <Link to="/mensagens" className="hidden md:flex items-center text-gray-700 hover:text-gray-900">
            <FaCommentDots size={18} className="mr-1" />
            Chat
          </Link>
          <Link to="/notificacoes" className="hidden md:flex items-center text-gray-700 hover:text-gray-900">
            <FaBell size={18} className="mr-1" />
            Notificações
          </Link>
          {loggedUser ? (
            <Link to="/painelusuario" className="hidden md:flex items-center text-gray-700 hover:text-gray-900">
              <FaUserCircle size={18} className="mr-1" />
              {loggedUser.apelido || loggedUser.nome || "Meu Perfil"}
            </Link>
          ) : (
            <Link to="/login" className="hidden md:flex items-center text-gray-700 hover:text-gray-900">
              <FaUserCircle size={18} className="mr-1" />
              Login
            </Link>
          )}
          <Link
            to="/publicar-entulho"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Anunciar grátis
          </Link>
        </div>
      </div>

      {/* BARRA DE BUSCA PARA MOBILE */}
      <div className="flex md:hidden bg-gray-100 px-4 py-2">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            placeholder="Buscar em Desentulhaê"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700 transition"
          >
            <FaSearch />
          </button>
        </form>
      </div>
    </header>
  )
}

export default Header
