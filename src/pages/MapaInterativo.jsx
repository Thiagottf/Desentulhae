import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Ajuste os ícones do Leaflet (pois os padrões podem não aparecer corretamente)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
})

const MapaInterativo = () => {
const [userPosition, setUserPosition] = useState([ -23.55052, -46.633308 ]) // Posição default (São Paulo)
const [posts, setPosts] = useState([])

useEffect(() => {
    // Tenta obter a localização do usuário
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
        console.error("Erro ao obter localização:", error)
        }
    )
    }

    // Recupera os anúncios do localStorage
    const postsData = JSON.parse(localStorage.getItem("posts")) || []
    setPosts(postsData)
}, [])

return (
    <div className="min-h-screen p-4">
    <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
        Mapa Interativo dos Entulhos
    </h1>
    <MapContainer center={userPosition} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {posts.map((post, index) => {
          // Exibe o pin somente se o anúncio possuir latitude e longitude
        if (post.latitude && post.longitude) {
            return (
            <Marker key={index} position={[post.latitude, post.longitude]}>
                <Popup>
                <strong>{post.titulo}</strong>
                <br />
                {post.localizacao}
                <br />
                <a href={`/detalhes/${post.id}`}>Ver detalhes</a>
                </Popup>
            </Marker>
            )
        }
        return null
        })}
    </MapContainer>
    </div>
)
}

export default MapaInterativo
