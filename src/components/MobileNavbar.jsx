import { Link } from "react-router-dom"
import { FaHome, FaSearch, FaPlusCircle, FaRegEnvelope, FaBars } from "react-icons/fa"

const MobileNavbar = () => {
return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-2 flex justify-around items-center md:hidden z-50">
    <Link to="/home" className="flex flex-col items-center text-gray-700">
        <FaHome size={20} />
        <span className="text-xs">Home</span>
    </Link>
    <Link to="/buscar" className="flex flex-col items-center text-gray-700">
        <FaSearch size={20} />
        <span className="text-xs">Buscar</span>
    </Link>
    <Link to="/publicar-entulho" className="flex flex-col items-center text-gray-700">
        <FaPlusCircle size={20} />
        <span className="text-xs">Anunciar</span>
    </Link>
    <Link to="/mensagens" className="flex flex-col items-center text-gray-700">
        <FaRegEnvelope size={20} />
        <span className="text-xs">Mensagens</span>
    </Link>
    <Link to="/menu" className="flex flex-col items-center text-gray-700">
        <FaBars size={20} />
        <span className="text-xs">Menu</span>
    </Link>
    </nav>
)
}

export default MobileNavbar
