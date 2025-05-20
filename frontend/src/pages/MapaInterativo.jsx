import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Configurar ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapaInterativo = () => {
  const [userPosition, setUserPosition] = useState([-23.55052, -46.633308]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Geolocalização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (err) => console.error("Erro ao obter localização:", err)
      );
    }
    // Carrega anúncios da API
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/entulhos');
        setPosts(data);
      } catch (err) {
        console.error('Erro ao carregar entulhos', err);
        setError('Não foi possível carregar os anúncios.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Carregando mapa...</p>;
  }
  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
        Mapa Interativo dos Anúncios
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate('/mapa-reportados')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ver Mapas Reportados
        </button>
      </div>
      <MapContainer
        center={userPosition}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {posts.map((post) => (
          post.latitude && post.longitude && (
            <Marker key={post.id} position={[post.latitude, post.longitude]}>
              <Popup>
                <strong>{post.titulo}</strong><br />
                {post.localizacao}<br />
                <a href={`/detalhes/${post.id}`}>Ver detalhes</a>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaInterativo;
