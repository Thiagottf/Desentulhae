import { useState } from "react"
import { useNavigate } from "react-router-dom"

const PublicarEntulho = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    contato: "",
    categoria: "",
    preco: "",
    volume: "",
    detalhesTipo: "",
    transacao: "",       // Novo campo: Venda ou Doação
    imagens: [],
    latitude: null,
    longitude: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length < 4) {
      alert("Por favor, faça upload de no mínimo 4 fotos.")
      return
    }
    const promises = files.map(file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = () => reject("Erro ao ler o arquivo")
        reader.readAsDataURL(file)
      })
    )
    Promise.all(promises)
      .then(results => {
        setForm(prevForm => ({ ...prevForm, imagens: results }))
      })
      .catch(() => {
        alert("Erro ao processar as imagens.")
      })
  }

  // Função para usar a localização do dispositivo com geocodificação reversa
  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const displayAddress = data.display_name || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
            setForm(prevForm => ({
              ...prevForm,
              latitude,
              longitude,
              localizacao: displayAddress
            }))
          } catch {
            alert("Não foi possível obter seu endereço. Mostrando coordenadas.")
            setForm(prevForm => ({
              ...prevForm,
              latitude,
              longitude,
              localizacao: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
            }))
          }
        },
        () => {
          alert("Não foi possível obter sua localização.")
        }
      )
    } else {
      alert("Geolocalização não é suportada pelo seu navegador.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.imagens || form.imagens.length < 4) {
      alert("Por favor, faça upload de no mínimo 4 fotos.")
      return
    }
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
    const novoPost = {
      ...form,
      id: Date.now(),
      usuario: loggedUser.email,
      dataPublicacao: new Date().toISOString()
    }
    const posts = JSON.parse(localStorage.getItem("posts")) || []
    posts.push(novoPost)
    localStorage.setItem("posts", JSON.stringify(posts))
    alert("Entulho publicado com sucesso!")
    navigate("/home")
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-600 to-lime-500 p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-8 shadow-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Voltar
        </button>
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center mb-6">Publicar Entulho</h1>
          
          <div className="mb-4">
            <label className="block mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              placeholder="Digite o título do anúncio"
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              required
              placeholder="Descreva os detalhes do entulho"
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
              rows="4"
            />
          </div>

          {/* Campo Preço */}
          <div className="mb-4">
            <label className="block mb-1">Preço</label>
            <input
              type="text"
              name="preco"
              value={form.preco}
              onChange={handleChange}
              required
              placeholder="Ex: R$ 100"
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
          </div>

          {/* Campo Volume */}
          <div className="mb-4">
            <label className="block mb-1">Volume (ex: 5 m³)</label>
            <input
              type="text"
              name="volume"
              value={form.volume}
              onChange={handleChange}
              required
              placeholder="Digite o volume do entulho"
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
          </div>

          {/* Campo Detalhes do Tipo */}
          <div className="mb-4">
            <label className="block mb-1">Detalhes do Tipo</label>
            <textarea
              name="detalhesTipo"
              value={form.detalhesTipo}
              onChange={handleChange}
              required
              placeholder="Ex: Reaproveitável, para reciclagem, etc."
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
              rows="3"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Localização</label>
            <input
              type="text"
              name="localizacao"
              value={form.localizacao}
              onChange={handleChange}
              required
              placeholder="Digite a localização ou use o GPS"
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleUseLocation}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Usar minha localização
            </button>
          </div>
          
          {form.latitude && form.longitude && (
            <div className="mb-4">
              <iframe
                title="Localização do Anúncio"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAx0DeehZOkRIRl1mAIiwNtCvpyE15qtDU&q=${form.latitude},${form.longitude}`}
                allowFullScreen
              ></iframe>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block mb-1">Contato (Telefone/WhatsApp)</label>
            <input
              type="text"
              name="contato"
              value={form.contato}
              onChange={handleChange}
              required
              placeholder="Digite seu contato"
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 placeholder-white text-white focus:outline-none"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Tipo de Entulho</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 text-black focus:outline-none"
            >
              <option value="">Selecione uma categoria</option>
              <option value="A">Classe A - Alvenarias, concreto, argamassas e solos</option>
              <option value="B">Classe B - Madeira, metal, plástico, papel, vidro</option>
              <option value="C">Classe C - Resíduos sem tecnologia para reciclagem (gesso, isopor)</option>
              <option value="D">Classe D - Resíduos perigosos (tintas, solventes, óleos, etc.)</option>
            </select>
          </div>

          {/* Novo Campo: Tipo de Transação */}
          <div className="mb-4">
            <label className="block mb-1">Tipo de Transação</label>
            <select
              name="transacao"
              value={form.transacao}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 text-black focus:outline-none"
            >
              <option value="">Selecione o tipo de transação</option>
              <option value="venda">Venda</option>
              <option value="doacao">Doação</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Imagens (mínimo 4)</label>
            <input
              type="file"
              name="imagens"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 bg-transparent border border-white/30 text-white focus:outline-none"
            />
          </div>
          
          <div className="mb-4">
            <details className="bg-white/20 p-2 rounded">
              <summary className="cursor-pointer">Mais informações sobre as categorias de entulho</summary>
              <p className="text-xs mt-2">
                <strong>Classe A:</strong> Alvenarias, concreto, argamassas e solos. Estes resíduos podem ser processados em britadores móveis, que viabilizam a reciclagem para reaproveitamento ou uso como lastro na obra. <br />
                <strong>Classe B:</strong> Restos de madeira, metal, plástico, papel, papelão e vidros – podem ser reutilizados ou encaminhados para reciclagem. <br />
                <strong>Classe C:</strong> Resíduos sem tecnologia para reciclagem, como gesso e isopor. <br />
                <strong>Classe D:</strong> Resíduos perigosos, como tintas, solventes, óleos e outros, que exigem descarte adequado.
              </p>
            </details>
          </div>
          
          <button
            type="submit"
            className="w-full bg-white text-green-800 font-semibold py-2 rounded-full hover:bg-gray-100 transition"
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  )
}

export default PublicarEntulho
