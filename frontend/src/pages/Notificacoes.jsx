import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Notificacoes = () => {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!loggedUser) {
      alert("Você precisa estar logado para acessar as notificações.");
      navigate("/");
      return;
    }
    const keyNotificacoes = `notificacoes_${loggedUser.email}`;
    const storedNotificacoes = JSON.parse(localStorage.getItem(keyNotificacoes)) || [];
    setNotificacoes(storedNotificacoes);
  }, [navigate]);

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
  );
};

export default Notificacoes;
