import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportarEntulho = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState({
    descricao: "",
    localizacao: "",
    latitude: null,
    longitude: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const displayAddress =
              data.display_name ||
              `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
            setReport({
              ...report,
              latitude,
              longitude,
              localizacao: displayAddress,
            });
          } catch {
            alert("Não foi possível obter seu endereço. Usando coordenadas.");
            setReport({
              ...report,
              latitude,
              longitude,
              localizacao: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
            });
          }
        },
        () => {
          alert("Não foi possível obter sua localização.");
        }
      );
    } else {
      alert("Geolocalização não é suportada pelo seu navegador.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!report.localizacao) {
      alert("Por favor, informe a localização ou use o GPS.");
      return;
    }
    // Salvar o relatório de entulho no localStorage
    const reports = JSON.parse(localStorage.getItem("reportedEntulhos")) || [];
    const newReport = {
      ...report,
      id: Date.now(),
      dataReport: new Date().toISOString(),
    };
    reports.push(newReport);
    localStorage.setItem("reportedEntulhos", JSON.stringify(reports));
    alert("Entulho reportado com sucesso!");
    navigate("/mapa");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-center mb-6">Reportar Entulho</h1>
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
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Usar minha localização
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Reportar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportarEntulho;
