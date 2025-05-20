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
    transacao: "", // Venda ou Doação
    preco: "",
    volume: "",
    detalhesTipo: "",
    imagens: [],
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "preco") {
      value = value.replace(/[^0-9.]/g, "");
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 4) {
      setError("Faça upload de no mínimo 4 fotos.");
      return;
    }
    Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject("Erro ao ler arquivo");
          reader.readAsDataURL(file);
        })
      )
    )
      .then((results) => {
        setForm((prev) => ({ ...prev, imagens: results }));
        setError("");
      })
      .catch(() => setError("Erro ao processar imagens."));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await resp.json();
          const display = data.display_name ||
            `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
          setForm((prev) => ({ ...prev, latitude, longitude, localizacao: display }));
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
      () => setError("Não foi possível obter localização.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.imagens.length < 4) {
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
      console.error(err);
      setError("Erro ao publicar entulho.");
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
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
              rows="4"
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
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

          <div className="mb-4">
            <label className="block mb-1">Tipo de Entulho</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-black/30 focus:outline-none"
            >
              <option value="">Selecione uma categoria</option>
              <option value="A">Classe A - Alvenarias, concreto...</option>
              <option value="B">Classe B - Madeira, metal...</option>
              <option value="C">Classe C - Gesso, isopor...</option>
              <option value="D">Classe D - Resíduos perigosos</option>
            </select>
          </div>

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

          {form.transacao === "venda" && (
            <div className="mb-4 flex items-center">
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
                inputMode="decimal"
                className="flex-1 p-3 rounded-r-lg border border-black/30 focus:outline-none"
              />
            </div>
          )}

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

          <div className="mb-4">
            <label className="block mb-1">Imagens (mínimo 4)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-black/30 focus:outline-none"
            />
          </div>

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
