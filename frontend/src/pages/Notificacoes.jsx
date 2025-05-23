import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Notificacoes = () => {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const { data } = await api.get('/notificacoes');
        setNotificacoes(data);
      } catch (err) {
        console.error('Erro ao carregar notificações', err);
        setError('Não foi possível carregar notificações.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Carregando notificações...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

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
          {notificacoes.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white p-4 rounded shadow mb-4 border-l-4 ${
                notif.lida ? 'border-gray-300' : 'border-green-500'
              }`}
            >
              <p className="text-gray-800">{notif.mensagem}</p>
              <span className="text-xs text-gray-600 block mt-1">
                {new Date(notif.criado_em).toLocaleString('pt-BR')}
              </span>

              {!notif.lida && (
                <button
                  onClick={async () => {
                    await api.patch(`/notificacoes/${notif.id}/lida`);
                    setNotificacoes((prev) =>
                      prev.map((n) =>
                        n.id === notif.id ? { ...n, lida: true } : n
                      )
                    );
                  }}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Marcar como lida
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notificacoes;
