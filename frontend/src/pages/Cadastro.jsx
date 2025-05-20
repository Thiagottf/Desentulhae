import { useState } from "react"
import { useNavigate } from "react-router-dom"
import background from "../assets/CaminhaoDeEntulho.jpg"
import api from "../services/api";

const Cadastro = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    apelido: "",
    nascimento: "",
    telefone: "",
    email: "",
    senha: "",
  })
  const [errorField, setErrorField] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errorField === name) {
      setErrorField(null)
      setErrorMessage("")
    }
  }

  const senhaValida = (senha) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!$&#])[A-Za-z\d@!$&#]{8,}$/
    return regex.test(senha)
  }

  const handleCadastro = async (e) => {
    e.preventDefault()
    setErrorField(null)
    setErrorMessage("")

    if (!senhaValida(form.senha)) {
      setErrorField("senha")
      setErrorMessage(
        "A senha deve ter ao menos 8 caracteres, incluindo maiúsculas, minúsculas, número e caractere especial."
      )
      return
    }

    try {
      await api.post('/auth/register', {
        cpf: form.cpf,
        nome_completo: form.nome,
        apelido: form.apelido,
        data_nascimento: form.nascimento,
        telefone: form.telefone,
        email: form.email,
        senha: form.senha,
      })
      navigate("/login")
    } catch (err) {
      const data = err.response?.data || {}
      setErrorField(data.field)
      setErrorMessage(data.error || "Erro ao cadastrar usuário.")
    }
  }

  const inputClass = (name) =>
    `rounded-lg p-3 bg-transparent border ${
      errorField === name ? "border-red-500" : "border-white/30"
    } placeholder-white text-white focus:outline-none`

  return (
    <div
      className="flex justify-center items-center h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-8 shadow-lg">
        <form onSubmit={handleCadastro}>
          <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                required
                value={form.cpf}
                onChange={handleChange}
                className={inputClass("cpf")}
              />
              {errorField === "cpf" && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                required
                value={form.nome}
                onChange={handleChange}
                className={inputClass("nome")}
              />
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                name="apelido"
                placeholder="Como deseja ser chamado"
                required
                value={form.apelido}
                onChange={handleChange}
                className={inputClass("apelido")}
              />
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                name="nascimento"
                required
                value={form.nascimento}
                onChange={handleChange}
                className={inputClass("nascimento")}
              />
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                required
                value={form.telefone}
                onChange={handleChange}
                className={inputClass("telefone")}
              />
              {errorField === "telefone" && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className="rounded-lg p-3 mt-4 w-full bg-transparent border border-white/30 placeholder-white text-white"
            />
            {errorField === "email" && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>




          
          <div className="mt-4 flex flex-col">
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              required
              value={form.senha}
              onChange={handleChange}
              className={inputClass("senha")}
            />
            {errorField === "senha" && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
            <p className="text-xs mt-2 text-white">
              Para sua segurança, crie uma senha com no mínimo:
              <br />
              • 8 ou mais caracteres
              <br />
              • Uma letra maiúscula, uma minúscula
              <br />
              • Um número e um caractere especial (ex: @ ! $ & #)
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-white text-green-800 font-semibold py-2 rounded-full hover:bg-gray-100 transition mt-6"
          >
            Cadastrar
          </button>
          <div className="text-sm text-center mt-6">
            <p>
              Já tem uma conta?{' '}
              <a href="/login" className="font-semibold hover:underline">
                Entrar
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Cadastro
