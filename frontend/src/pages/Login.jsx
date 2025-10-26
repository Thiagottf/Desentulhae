import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Input from "../components/Input";
import { useAuth } from "../contexts/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await login({ email, senha, remember });
      navigate("/home");
    } catch (err) {
      setErrorMessage(err?.message || "Credenciais inválidas.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔸 Inputs com borda visível e foco laranja (marca Desentulhaê)
  const inputClass =
    "w-full h-12 bg-white border-2 border-gray-400 rounded-md shadow-sm px-4 pr-10 " +
    "placeholder-gray-500 text-gray-900 focus:outline-none " +
    "focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/40";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-baseline justify-center gap-6">
        {/* 🟠 ESQUERDA — marca e descrição */}
        <div className="relative text-center md:text-left md:w-1/2 -mt-8 group">
          {/* texto padrão */}
          <h1 className="text-[44px] md:text-[56px] font-bold text-[#f97316] leading-none cursor-pointer">
            Desentulhaê
          </h1>
          <p className="mt-3 md:mt-4 text-xl md:text-2xl text-gray-800 max-w-xl">
            Transforme entulho em oportunidade — com o Desentulhaê, nada se perde.
          </p>
        </div>
        {/* 🔷 DIREITA — cartão de login */}
        <div className="md:w-[396px] w-full">
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-4 md:p-4">
            <form onSubmit={handleLogin} className="space-y-3">
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-md border border-red-300 bg-red-50 text-red-700 text-sm px-3 py-2"
                >
                  {errorMessage}
                </div>
              )}

              {/* ✉️ E-mail */}
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email ou telefone"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
                <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* 🔒 Senha */}
              <div className="relative">
                <Input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={inputClass}
                />
                <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-md bg-[#f97316] text-white font-semibold text-lg hover:brightness-95 active:brightness-90 disabled:opacity-60 transition"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>

              {/* Esqueceu a senha */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-[#f97316] text-sm hover:underline"
                  onClick={() => alert("Recuperação de senha em breve.")}
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* divisor */}
              <div className="w-full h-px bg-gray-200 my-2" />

              {/* Botão Criar conta */}
              <button
                type="button"
                className="w-fit mx-auto block px-5 h-12 rounded-md bg-[#42b72a] text-white font-semibold text-base hover:brightness-95 active:brightness-90"
                onClick={() => navigate("/cadastro")}
              >
                Criar nova conta
              </button>
            </form>
          </div>

          {/* Rodapé pequeno */}
          <div className="text-center text-sm text-gray-700 mt-5">
            <span className="font-semibold hover:underline cursor-pointer">
              Crie uma Página
            </span>{" "}
            para uma cooperativa, uma marca ou uma empresa.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
