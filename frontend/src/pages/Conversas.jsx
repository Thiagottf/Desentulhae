import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

const Conversas = () => {
const navigate = useNavigate()
const [conversas, setConversas] = useState([])
const [loading, setLoading] = useState(true)
const [erro, setErro] = useState("")

useEffect(() => {
    (async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) {
        navigate("/login")
        return
    }

    try {
        setLoading(true)
        const resp = await api.get("/conversas") // O token já vai no header
        setConversas(resp.data)
    } catch (err) {
        console.error("Erro ao carregar conversas", err)
        setErro("Erro ao buscar suas conversas.")
    } finally {
        setLoading(false)
    }
    })()
}, [navigate])

if (loading) return <p className="text-center mt-10">Carregando conversas...</p>
if (erro) return <p className="text-center text-red-500 mt-10">{erro}</p>

return (
    <div className="min-h-screen p-4 bg-gray-100">
    <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Minhas Conversas</h1>
    {conversas.length === 0 ? (
        <p className="text-center text-gray-600">Você ainda não iniciou nenhuma conversa.</p>
    ) : (
        <div className="max-w-3xl mx-auto space-y-4">
        {conversas.map((conv) => (
            <Link to={`/mensagens/${conv.entulhoId}`} key={conv.entulhoId}>
            <div className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 transition cursor-pointer">
                <p className="font-semibold text-lg">{conv.titulo}</p>
                <p className="text-gray-600 text-sm">
                Última mensagem: {conv.ultimaMensagem?.text?.slice(0, 50) || "Sem mensagens ainda..."}
                </p>
            </div>
            </Link>
        ))}
        </div>
    )}
    </div>
)
}

export default Conversas
