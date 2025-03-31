import { Link } from "react-router-dom"

const Footer = () => {
return (
    <footer className="bg-gray-200 mt-8 py-4">
    <div className="max-w-7xl mx-auto px-4 text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center">
        <p className="mb-2 md:mb-0">
        © {new Date().getFullYear()} Desentulhaê - Todos os direitos reservados.
        </p>
        <div className="flex gap-4">
        <Link to="/termos" className="hover:underline">
            Termos de Uso
        </Link>
        <Link to="/privacidade" className="hover:underline">
            Política de Privacidade
        </Link>
        <Link to="/contato" className="hover:underline">
            Contato
        </Link>
        </div>
    </div>
    </footer>
)
}

export default Footer
