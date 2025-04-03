import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

// Configurando os ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapaReportados = () => {
  const [reports, setReports] = useState([]);
  const [mapCenter, setMapCenter] = useState([-3.119, -60.0217]); // Centro padrão, ajuste conforme necessário
  const navigate = useNavigate(); // Inicializa o hook useNavigate

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reportedEntulhos")) || [];
    setReports(storedReports);
    // Centraliza o mapa na média dos pontos, se houver
    if (storedReports.length > 0) {
      const latitudes = storedReports.map(r => r.latitude).filter(lat => lat !== null);
      const longitudes = storedReports.map(r => r.longitude).filter(lng => lng !== null);
      if (latitudes.length > 0 && longitudes.length > 0) {
        const avgLat = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
        const avgLng = longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;
        setMapCenter([avgLat, avgLng]);
      }
    }
  }, []);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
        Mapa de Entulhos Reportados
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate("/mapa")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Voltar ao Mapa de Anúncios
        </button>
      </div>
      <MapContainer center={mapCenter} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => {
          if (report.latitude && report.longitude) {
            return (
              <Marker key={report.id} position={[report.latitude, report.longitude]}>
                <Popup>
                  <strong>{report.descricao}</strong>
                  <br />
                  <small>{report.localizacao}</small>
                  <br />
                  <small>{new Date(report.dataReport).toLocaleString()}</small>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MapaReportados;
