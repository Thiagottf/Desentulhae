import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"

const Chat = () => {
const { id } = useParams() // id do anúncio
const navigate = useNavigate()
 const [post, setPost] = useState(null)
const [chatMessages, setChatMessages] = useState([])
const [newMessage, setNewMessage] = useState("")
const chatContainerRef = useRef(null)

useEffect(() => {
    // Verifica se o usuário está logado
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!loggedUser) {
    alert("Você precisa estar logado para acessar o chat.")
    navigate("/")
    return
    }

    // Carrega o anúncio a partir do localStorage
    const posts = JSON.parse(localStorage.getItem("posts")) || []
    const foundPost = posts.find(p => p.id === Number(id))
    if (!foundPost) {
    alert("Anúncio não encontrado.")
    navigate("/home")
    return
    }
    setPost(foundPost)

    // Define o identificador da conversa: combinação do id do anúncio e do anunciante
    const conversationId = `chat_${foundPost.id}_${foundPost.usuario}`
    const storedChat = JSON.parse(localStorage.getItem(conversationId)) || []
    setChatMessages(storedChat)
}, [id, navigate])

const handleSend = (e) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
    const conversationId = `chat_${post.id}_${post.usuario}`
    const message = {
    sender: loggedUser.email,
    text: newMessage,
    timestamp: new Date().toISOString()
    }
    const updatedChat = [...chatMessages, message]
    setChatMessages(updatedChat)
    localStorage.setItem(conversationId, JSON.stringify(updatedChat))
    setNewMessage("")

    // Rola para o final da lista de mensagens
    setTimeout(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
    }, 100)
}

return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
    <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition self-start"
    >
        Voltar
    </button>
    <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
        Chat com o Anunciante
    </h1>

    {post && (
        <div className="mb-4 p-4 bg-white rounded shadow">
        <p>
            <strong>Anúncio:</strong> {post.titulo}
        </p>
        <p>
            <strong>Anunciante:</strong> {post.usuario}
        </p>
        </div>
    )}

    <div
        ref={chatContainerRef}
        className="flex-1 bg-white p-4 rounded shadow overflow-y-auto mb-4"
        style={{ maxHeight: "400px" }}
    >
        {chatMessages.length === 0 ? (
        <p className="text-center text-gray-600">
            Nenhuma mensagem ainda. Inicie a conversa!
        </p>
        ) : (
        chatMessages.map((msg, index) => {
            const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
            const isUser = msg.sender === loggedUser.email
            return (
            <div
                key={index}
                className={`mb-2 p-2 rounded ${
                isUser
                    ? "bg-green-200 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
            >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-600">
                {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
            </div>
            )
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
)
}

export default Chat
