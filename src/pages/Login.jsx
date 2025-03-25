import { FaUser, FaLock } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Input from "../components/input"
import background from "../assets/CaminhaoDeEntulho.jpg"

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    const user = JSON.parse(localStorage.getItem(email))
    if (user && user.senha === senha) {
      alert("Login realizado com sucesso!")
      localStorage.setItem("usuarioLogado", JSON.stringify(user))
      navigate("/home")
    } else {
      alert("Usuário ou senha inválidos.")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-center bg-cover" style={{ backgroundImage: `url(${background})` }}>
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-8 shadow-lg">
        <form onSubmit={handleLogin}>
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

          <div className="relative mb-5">
            <Input
              type="text"
              placeholder="Usuário"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-5 pr-10"
            />
            <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
          </div>

          <div className="relative mb-4">
            <Input
              type="password"
              placeholder="Senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pl-5 pr-10"
            />
            <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
          </div>

          <div className="flex justify-between text-sm mb-5">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-white" />
              Lembrar-me
            </label>
            <a href="#" className="hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-green-800 font-semibold py-2 rounded-full hover:bg-gray-100 transition"
          >
            Login
          </button>

          <div className="text-sm text-center mt-6">
            <p>
              Não tem uma conta?{" "}
              <a href="/cadastro" className="font-semibold hover:underline">
                Registrar
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
