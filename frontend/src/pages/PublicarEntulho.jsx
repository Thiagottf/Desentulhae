import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PublicarEntulho = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    contato: "",
    categoria: "",
    transacao: "",
    preco: "",
    volume: "",
    detalhesTipo: "",
    imagens: [],
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "preco") {
      value = value.replace(/[^0-9.]/g, "");
    }
    setForm({ ...form, [name]: value });
  };

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length < 4) {
    alert("Por favor, envie no mínimo 4 fotos.");
    return;
  }

  const promises = files.map(file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject("Erro ao ler imagem");
      reader.readAsDataURL(file);
    })
  );

  Promise.all(promises)
    .then(base64List => {
      setForm(prev => ({ ...prev, imagens: base64List }));
    })
    .catch(() => {
      alert("Erro ao processar as imagens.");
    });
};


  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await resp.json();
          const display =
            data.display_name ||
            `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
          setForm((prev) => ({
            ...prev,
            latitude,
            longitude,
            localizacao: display,
          }));
          setError("");
        } catch {
          setForm((prev) => ({
            ...prev,
            latitude,
            longitude,
            localizacao: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
          }));
        }
      },
      () => setError("Não foi possível obter sua localização.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.imagens || form.imagens.length < 4) {
      setError("Faça upload de no mínimo 4 fotos.");
      return;
    }
    if (form.transacao === "venda" && !form.preco) {
      setError("Informe um preço para venda.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/entulhos", form);
      navigate("/home");
    } catch (err) {
      console.error("Erro ao publicar entulho", err);
      setError("Falha ao publicar entulho.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-accent p-4">
      <div className="w-full max-w-2xl bg-white border border-black/20 text-black rounded-xl p-8 shadow-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 bg-secondary text-white px-4 py-2 rounded hover:brightness-90 transition"
        >
          Voltar
        </button>
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center mb-6">Publicar Entulho</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Título */}
          <div className="mb-4">
            <label className="block mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              placeholder="Digite o título do anúncio"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
          </div>

          {/* Descrição */}
          <div className="mb-4">
            <label className="block mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              required
              placeholder="Descreva os detalhes do entulho"
              rows="4"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
          </div>

          {/* Localização */}
          <div className="mb-4">
            <label className="block mb-1">Localização</label>
            <input
              type="text"
              name="localizacao"
              value={form.localizacao}
              onChange={handleChange}
              required
              placeholder="Digite a localização ou use o GPS"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleUseLocation}
              className="mt-2 bg-secondary text-white px-3 py-1 rounded hover:brightness-90 transition"
            >
              Usar minha localização
            </button>
          </div>

          {/* Contato */}
          <div className="mb-4">
            <label className="block mb-1">Contato (Telefone/WhatsApp)</label>
            <input
              type="text"
              name="contato"
              value={form.contato}
              onChange={handleChange}
              required
              placeholder="Digite seu contato"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
          </div>

          {/* Categoria */}
          <div className="mb-4">
            <label className="block mb-1">Tipo de Entulho</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            >
              <option value="">Selecione a categoria do entulho</option>
<option value="1">
  Classe A – Resíduos reutilizáveis ou recicláveis como agregados
</option>
<option value="2">
  Classe B – Resíduos recicláveis para outras destinações (plástico, papel, metais...)
</option>
<option value="3">
  Classe C – Resíduos sem tecnologia economicamente viável para reciclagem
</option>
<option value="4">
  Classe D – Resíduos perigosos ou contaminados (tintas, amianto, óleos, solventes)
</option>

            </select>
          </div>

          {/* Transação */}
          <div className="mb-4">
            <label className="block mb-1">Tipo de Transação</label>
            <select
              name="transacao"
              value={form.transacao}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            >
              <option value="">Selecione...</option>
              <option value="venda">Venda</option>
              <option value="doacao">Doação</option>
            </select>
          </div>

          {/* Preço (apenas para venda) */}
          {form.transacao === "venda" && (
            <div className="mb-4">
              <label className="block mb-1">Preço</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-black/10 rounded-l-lg">
                  R$
                </span>
                <input
                  type="text"
                  name="preco"
                  value={form.preco}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="flex-1 p-3 rounded-r-lg border border-black/30 focus:outline-none"
                  inputMode="decimal"
                />
              </div>
            </div>
          )}

          {/* Volume */}
          <div className="mb-4">
            <label className="block mb-1">Volume (ex: 5 m³)</label>
            <input
              type="text"
              name="volume"
              value={form.volume}
              onChange={handleChange}
              required
              placeholder="Digite o volume do entulho"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
          </div>

          {/* Detalhes do Tipo */}
          <div className="mb-4">
            <label className="block mb-1">Detalhes do Tipo</label>
            <textarea
              name="detalhesTipo"
              value={form.detalhesTipo}
              onChange={handleChange}
              required
              placeholder="Ex: Reaproveitável, para reciclagem"
              rows="3"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            />
          </div>

          {/* Imagens */}
          <div className="mb-4">
            <label className="block mb-1">Imagens (mínimo 4)</label>
            <input
              type="file"
              name="imagens"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-black/30 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2 rounded-full hover:brightness-90 transition"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicarEntulho;