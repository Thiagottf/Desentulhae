import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ReportarEntulho = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState({
    descricao: "",
    localizacao: "",
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const displayAddress = data.display_name ||
            `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
          setReport(prev => ({
            ...prev,
            latitude,
            longitude,
            localizacao: displayAddress,
          }));
          setError("");
        } catch {
          setReport(prev => ({
            ...prev,
            latitude,
            longitude,
            localizacao: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
          }));
          setError("");
        }
      },
      () => setError("Não foi possível obter sua localização.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!report.localizacao) {
      setError("Por favor, informe a localização ou use o GPS.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/reports", report);
      navigate("/mapa");
    } catch (err) {
      console.error("Erro ao reportar entulho", err);
      setError("Erro ao reportar entulho.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-accent p-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 bg-secondary text-white px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-center mb-6">Reportar Entulho</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Descrição do Reporte</label>
            <textarea
              name="descricao"
              value={report.descricao}
              onChange={handleChange}
              required
              placeholder="Descreva o entulho e suas condições"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Localização</label>
            <input
              type="text"
              name="localizacao"
              value={report.localizacao}
              onChange={handleChange}
              required
              placeholder="Digite a localização ou use o GPS"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleUseLocation}
              className="mt-2 bg-secondary text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Usar minha localização
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? "Enviando..." : "Reportar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportarEntulho;
