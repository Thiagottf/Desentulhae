import { useState } from "react"
import { useNavigate } from "react-router-dom"
import background from "../assets/CaminhaoDeEntulho.jpg"

const Cadastro = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    apelido: "",
    nascimento: "",
    email: "",
    senha: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const senhaValida = (senha) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!$&#])[A-Za-z\d@!$&#]{8,}$/
    return regex.test(senha)
  }

  const handleCadastro = (e) => {
    e.preventDefault()

    if (!senhaValida(form.senha)) {
      alert("A senha não atende aos requisitos de segurança.")
      return
    }

    localStorage.setItem(form.email, JSON.stringify(form))
    alert("Cadastro realizado com sucesso!")
    navigate("/login")
  }

  return (
    <div className="flex justify-center items-center h-screen bg-center bg-cover" style={{ backgroundImage: `url(${background})` }}>
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-8 shadow-lg">
        <form onSubmit={handleCadastro}>
          <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              required
              value={form.cpf}
              onChange={handleChange}
              className="rounded-lg p-3 bg-transparent border border-white/30 placeholder-white text-white"
            />
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              required
              value={form.nome}
              onChange={handleChange}
              className="rounded-lg p-3 bg-transparent border border-white/30 placeholder-white text-white"
            />
            <input
              type="text"
              name="apelido"
              placeholder="Como deseja ser chamado"
              required
              value={form.apelido}
              onChange={handleChange}
              className="rounded-lg p-3 bg-transparent border border-white/30 placeholder-white text-white"
            />
            <input
              type="date"
              name="nascimento"
              required
              value={form.nascimento}
              onChange={handleChange}
              className="rounded-lg p-3 bg-transparent border border-white/30 text-white"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="rounded-lg p-3 mt-4 w-full bg-transparent border border-white/30 placeholder-white text-white"
          />

          <input
            type="password"
            name="senha"
            placeholder="Senha"
            required
            value={form.senha}
            onChange={handleChange}
            className="rounded-lg p-3 mt-4 w-full bg-transparent border border-white/30 placeholder-white text-white"
          />

          <p className="text-xs mt-2 mb-4 text-white">
            Para sua segurança, crie uma senha com no mínimo: <br />
            • 8 ou mais caracteres <br />
            • Uma letra maiúscula, uma minúscula <br />
            • Um número e um caractere especial (ex: @ ! $ & #)
          </p>

          <button
            type="submit"
            className="w-full bg-white text-green-800 font-semibold py-2 rounded-full hover:bg-gray-100 transition"
          >
            Cadastrar
          </button>

          <div className="text-sm text-center mt-6">
            <p>
              Já tem uma conta?{" "}
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
