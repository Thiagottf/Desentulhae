import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Notificacoes = () => {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Checa autenticação
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        // Carrega notificações e status
        const [notifsResp, settingResp] = await Promise.all([
          api.get('/notificacoes'),
          api.get('/notificacoes/toggle')
        ]);
        setNotificacoes(notifsResp.data);
        setEnabled(settingResp.data.enabled);
      } catch (err) {
        console.error('Erro ao carregar notificações', err);
        setError('Não foi possível carregar notificações.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleToggle = async () => {
    try {
      const resp = await api.post('/notificacoes/toggle', { enabled: !enabled });
      setEnabled(resp.data.enabled);
    } catch (err) {
      console.error('Erro ao alternar notificações', err);
    }
  };

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

      <div className="mb-6 max-w-xl mx-auto bg-white p-4 rounded shadow flex justify-between items-center">
        <span className="font-semibold">Notificações Ativadas:</span>
        <button
          onClick={handleToggle}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {enabled ? 'Desativar' : 'Ativar'}
        </button>
      </div>

      {notificacoes.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma notificação encontrada.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {notificacoes.map((notif) => (
            <div key={notif.id} className="bg-white p-4 rounded shadow mb-4">
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
