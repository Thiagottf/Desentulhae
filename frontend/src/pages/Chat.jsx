import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Chat = () => {
  const { id } = useParams(); // id do anúncio
const navigate = useNavigate();
const [post, setPost] = useState(null);
const [chatMessages, setChatMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const chatContainerRef = useRef(null);

  // Função para decodificar o JWT
function parseJwt(token) {
    try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
    } catch {
    return null;
    }
}

useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const loggedUser = parseJwt(token);

    (async () => {
    setLoading(true);
    try {
        if (!token || !loggedUser) {
        navigate("/login");
        return;
        }

        const postResp = await api.get(`/entulhos/${id}`);
        setPost(postResp.data);

        const chatResp = await api.get(`/conversas/${id}`);
        setChatMessages(chatResp.data);
    } catch (err) {
        console.error("Erro ao carregar chat", err);
        setError("Não foi possível carregar o chat.");
    } finally {
        setLoading(false);
    }
    })();
}, [id, navigate]);

const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
    const resp = await api.post(`/conversas/${id}`, { text: newMessage });
    setChatMessages(resp.data);
    setNewMessage("");

    setTimeout(() => {
        if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, 100);
    } catch (err) {
    console.error("Erro ao enviar mensagem", err);
    }
};

if (loading) return <p className="text-center mt-10">Carregando chat...</p>;
if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // Pegamos o usuário aqui fora do efeito (apenas para renderização)
const token = localStorage.getItem("token") || sessionStorage.getItem("token");
const loggedUser = parseJwt(token);

return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
    <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition self-start"
    >
        Voltar
    </button>
    <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">Chat com o Anunciante</h1>

    {post && (
        <div className="mb-4 p-4 bg-white rounded shadow">
        <p><strong>Anúncio:</strong> {post.titulo}</p>
        <p><strong>Local:</strong> {post.localizacao}</p>
        </div>
    )}

    <div
        ref={chatContainerRef}
        className="flex-1 bg-white p-4 rounded shadow overflow-y-auto mb-4"
        style={{ maxHeight: "400px" }}
    >
        {chatMessages.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma mensagem ainda. Inicie a conversa!</p>
        ) : (
        chatMessages.map((msg, idx) => {
            const isUser = loggedUser && msg.remetente_cpf === loggedUser.cpf;
            return (
            <div
                key={idx}
                className={`mb-2 p-2 rounded ${
                isUser ? "bg-green-200 self-end text-right" : "bg-gray-200 self-start text-left"
                }`}
            >
                <p className="text-sm">{msg.texto}</p>
                <span className="text-xs text-gray-600">
                {new Date(msg.enviado_em).toLocaleTimeString()}
                </span>
            </div>
            );
        })
        )}
    </div>

    <form onSubmit={handleSend} className="flex">
        <input
        type="text"
        placeholder="Digite sua mensagem..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 p-2 border rounded-l focus:outline-none"
        />
        <button
        type="submit"
        className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700 transition"
        >
        Enviar
        </button>
    </form>
    </div>
);
};

export default Chat;
