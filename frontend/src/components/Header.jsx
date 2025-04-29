import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSearch, FaCommentDots, FaBell, FaUserCircle, FaBlogger, FaMapMarkedAlt } from "react-icons/fa";
import logo from "../assets/cacambaEntulho.jpg";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (userData) {
      setLoggedUser(userData);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/buscar?query=${searchTerm}`);
  };

  return (
    <header className="bg-white shadow-md top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* LOGO E NOME */}
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center">
            <img src={logo} alt="Desentulhaê" className="w-8 h-8 mr-2" />
            <span className="text-xl font-bold text-secondary">Desentulhaê</span>
          </Link>
        </div>

        {/* BARRA DE BUSCA (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4 max-w-xl">
          <input
            type="text"
            placeholder="Buscar em Desentulhaê"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="bg-accent text-white px-4 rounded-r-md hover:brightness-90 transition"
          >
            <FaSearch />
          </button>
        </form>

        {/* LINKS E AÇÕES */}
        <div className="flex items-center gap-4">
          <Link to="/mensagens" className="hidden md:flex items-center text-secondary hover:text-primary">
            <FaCommentDots size={18} className="mr-1" />
            Chat
          </Link>
          <Link to="/notificacoes" className="hidden md:flex items-center text-secondary hover:text-primary">
            <FaBell size={18} className="mr-1" />
            Notificações
          </Link>
          <Link to="/blog" className="hidden md:flex items-center text-secondary hover:text-primary">
            <FaBlogger size={18} className="mr-1" />
            Blog
          </Link>
          <Link to="/mapa" className="hidden md:flex items-center text-secondary hover:text-primary">
            <FaMapMarkedAlt size={18} className="mr-1" />
            Mapa
          </Link>
          {loggedUser ? (
            <Link to="/painelusuario" className="hidden md:flex items-center text-secondary hover:text-primary">
              <FaUserCircle size={18} className="mr-1" />
              {loggedUser.apelido || loggedUser.nome || "Meu Perfil"}
            </Link>
          ) : (
            <Link to="/login" className="hidden md:flex items-center text-secondary hover:text-primary">
              <FaUserCircle size={18} className="mr-1" />
              Login
            </Link>
          )}
          <Link
            to="/publicar-entulho"
            className="bg-primary text-white px-4 py-2 rounded hover:brightness-90 transition"
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
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="bg-accent text-white px-4 rounded-r-md hover:brightness-90 transition"
          >
            <FaSearch />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
