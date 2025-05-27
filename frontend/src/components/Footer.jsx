import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary py-4">
      <div className="max-w-7xl mx-auto px-4 text-white text-sm flex flex-col md:flex-row justify-between items-center">
        <p className="mb-2 md:mb-0">
          © {new Date().getFullYear()} Desentulhaê - Todos os direitos reservados.
        </p>
        <div className="flex gap-4">
          <Link to="/termos" className="hover:underline hover:text-primary">
            Termos de Uso.
          </Link>
          <Link to="/privacidade" className="hover:underline hover:text-primary">
            Política de Privacidade.
          </Link>
          <Link to="/contato" className="hover:underline hover:text-primary">
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
