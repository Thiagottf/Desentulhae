import { FaUser, FaLock } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Input from "../components/input"
import background from "../assets/CaminhaoDeEntulho.jpg"
import { useAuth } from "../contexts/useAuth"


const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")
  const [remember, setRemember] = useState(false)
  const [errorField, setErrorField] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorField(null)
    setErrorMessage("")

    try {
      // Chama o login passando cpf, senha e remember
      await login({ cpf, senha, remember })
      navigate('/home')
    } catch (err) {
      // Destaca o campo CPF em caso de erro e mostra a mensagem
      setErrorField('cpf')
      setErrorMessage(err.message || 'Credenciais inválidas.')
    }
  }

  const inputClass = (name) =>
    `w-full pl-5 pr-10 p-2 rounded bg-transparent border focus:outline-none ${
      errorField === name ? 'border-red-500' : 'border-white/30'
    } text-white`

  return (
    <div
      className="flex justify-center items-center h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-8 shadow-lg">
        <form onSubmit={handleLogin}>
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          <div className="relative mb-5">
            <Input
              type="text"
              name="cpf"
              placeholder="CPF"
              required
              value={cpf}
              onChange={(e) => { setCpf(e.target.value); if (errorField === 'cpf') setErrorField(null) }}
              className={inputClass('cpf')}
            />
            <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
          </div>

          <div className="relative mb-4">
            <Input
              type="password"
              name="senha"
              placeholder="Senha"
              required
              value={senha}
              onChange={(e) => { setSenha(e.target.value); if (errorField === 'senha') setErrorField(null) }}
              className={inputClass('senha')}
            />
            <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
          </div>

          <div className="flex justify-between items-center text-sm mb-5">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-white"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
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
              Não tem uma conta?{' '}
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
