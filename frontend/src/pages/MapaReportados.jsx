import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Configurando ícones padrão do Leaflet
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
  const [mapCenter, setMapCenter] = useState([-3.119, -60.0217]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/reports');
        setReports(data);
        if (data.length > 0) {
          const latitudes = data.map(r => r.latitude).filter(lat => lat != null);
          const longitudes = data.map(r => r.longitude).filter(lng => lng != null);
          if (latitudes.length && longitudes.length) {
            const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
            const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
            setMapCenter([avgLat, avgLng]);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar relatórios', err);
        setError('Não foi possível carregar os entulhos reportados.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Carregando entulhos reportados...</p>;
  }
  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
        Mapa de Entulhos Reportados
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate('/mapa')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Voltar ao Mapa de Anúncios
        </button>
      </div>
      <MapContainer center={mapCenter} zoom={12} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          report.latitude && report.longitude && (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <strong>{report.descricao}</strong><br />
                <small>{report.localizacao}</small><br />
                <small>{new Date(report.dataReport).toLocaleString()}</small>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaReportados;
