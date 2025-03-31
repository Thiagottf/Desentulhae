import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Notificacoes = () => {
const navigate = useNavigate()
const [notificacoes, setNotificacoes] = useState([])
const [notificacoesAtivas, setNotificacoesAtivas] = useState(true)

useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!loggedUser) {
    alert("Você precisa estar logado para acessar as notificações.")
    navigate("/")
    return
    }
    const keyNotificacoes = `notificacoes_${loggedUser.email}`
    const storedNotificacoes = JSON.parse(localStorage.getItem(keyNotificacoes)) || []
    setNotificacoes(storedNotificacoes)
    
    // Carrega a configuração de notificações (ativa por padrão)
    const setting = localStorage.getItem(`notificacoesAtivas_${loggedUser.email}`)
    setNotificacoesAtivas(setting === null ? true : setting === "true")
}, [navigate])

const handleToggle = () => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"))
    const novoSetting = !notificacoesAtivas
    setNotificacoesAtivas(novoSetting)
    localStorage.setItem(`notificacoesAtivas_${loggedUser.email}`, novoSetting)
}

return (
    <div className="min-h-screen bg-gray-100 p-4">
    <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
    >
        Voltar
    </button>
    <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Notificações
    </h1>

    <div className="mb-6 max-w-xl mx-auto bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center">
        <span className="font-semibold">Notificações Ativadas:</span>
        <button
            onClick={handleToggle}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
            {notificacoesAtivas ? "Desativar" : "Ativar"}
        </button>
        </div>
    </div>

    {notificacoes.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma notificação encontrada.</p>
    ) : (
        <div className="max-w-4xl mx-auto">
        {notificacoes.map((notif, index) => (
            <div key={index} className="bg-white p-4 rounded shadow mb-4">
            <p>{notif.message}</p>
            <span className="text-xs text-gray-600">
                {new Date(notif.timestamp).toLocaleString()}
            </span>
            </div>
        ))}
        </div>
    )}
    </div>
)
}

export default Notificacoes
