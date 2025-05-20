// mesma importação
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

const Detalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await api.get(`/entulhos/${id}`);
        const fetchedPost = response.data;
        setPost(fetchedPost);

        try {
          const savedResp = await api.get("/usuarios/me/salvos");
          const savedList = savedResp.data;
          setIsSaved(savedList.some((item) => item.id === fetchedPost.id));
        } catch {
          // silencioso
        }
      } catch (err) {
        console.error("Erro ao carregar anúncio", err);
        setError("Anúncio não encontrado");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    try {
      if (isSaved) {
        await api.delete(`/usuarios/me/salvos/${id}`);
        setIsSaved(false);
      } else {
        await api.post(`/usuarios/me/salvos/${id}`);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Erro ao (des)salvar anúncio", err);
    }
  };

  const handleBuy = async () => {
    try {
      await api.post(`/entulhos/${id}/compra`);
      alert("Compra realizada! Anunciante notificado.");
    } catch {
      alert("Erro ao processar compra.");
    }
  };

  const handleSolicitar = async () => {
    try {
      await api.post(`/entulhos/${id}/doacao`);
      alert("Solicitação enviada! Anunciante notificado.");
    } catch {
      alert("Erro ao processar solicitação.");
    }
  };

  const handleOpenChat = () => navigate("/mensagens");

  const imgs = post?.imagens || [];
  const prevImg = () => setCurrentImg((i) => (i - 1 + imgs.length) % imgs.length);
  const nextImg = () => setCurrentImg((i) => (i + 1) % imgs.length);

  if (loading) return <p className="text-center mt-10">Carregando anúncio...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-secondary text-white px-4 py-2 rounded hover:brightness-90 transition"
      >
        Voltar
      </button>

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Carrossel de imagens */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-80 sm:w-96 md:w-[28rem] mx-auto aspect-square rounded-lg overflow-hidden">
              {imgs.length > 0 ? (
                <>
                  <img
                    src={imgs[currentImg]}
                    alt={`${post.titulo} ${currentImg + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {imgs.length > 1 && (
                    <>
                      <button
                        onClick={prevImg}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImg}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {imgs.map((_, idx) => (
                          <span
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === currentImg ? "bg-primary" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 p-4">
                  Sem imagem disponível
                </div>
              )}
            </div>
          </div>

          {/* Informações e ações */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{post.titulo}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {post.transacao === "venda" ? "Venda" : "Doação"}
                </span>
                {post.transacao === "venda" && post.preco && (
                  <span className="text-primary text-3xl font-semibold">
                    R$ {parseFloat(post.preco).toFixed(2)}
                  </span>
                )}
              </div>
              <ul className="text-gray-800 space-y-1">
                {post.volume && <li><strong>Volume:</strong> {post.volume}</li>}
                {post.detalhesTipo && <li><strong>Detalhes:</strong> {post.detalhesTipo}</li>}
                <li><strong>Localização:</strong> {post.localizacao}</li>
                <li><strong>Contato:</strong> {post.contato || "Não informado"}</li>
                <li><strong>Categoria:</strong> {post.categoria || "Não informada"}</li>
                <li>
                  <strong>Data de postagem:</strong>{" "}
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "Não disponível"}
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={handleOpenChat}
                className="flex-1 bg-secondary text-white px-4 py-2 rounded hover:brightness-90 transition"
              >
                Abrir Chat
              </button>
              {post.transacao === "venda" ? (
                <button
                  onClick={handleBuy}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded hover:brightness-90 transition"
                >
                  Comprar
                </button>
              ) : (
                <button
                  onClick={handleSolicitar}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded hover:brightness-90 transition"
                >
                  Solicitar
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:brightness-90 transition"
              >
                {isSaved ? "Remover dos Salvos" : "Salvar Anúncio"}
              </button>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Descrição</h2>
          <p className="text-gray-700">{post.descricao}</p>
        </div>

        {/* Mapa */}
        {post.localizacao && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Localização no Mapa</h2>
            <iframe
              title="Mapa"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAx0DeehZOkRIRl1mAIiwNtCvpyE15qtDU&q=${encodeURIComponent(
                post.localizacao
              )}`}
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Detalhes;
