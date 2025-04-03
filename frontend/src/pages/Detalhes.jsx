import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Detalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const foundPost = posts.find((p) => p.id === Number(id));
    if (foundPost) {
      setPost(foundPost);
      const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (loggedUser) {
        const salvosKey = `salvos_${loggedUser.email}`;
        const savedIds = JSON.parse(localStorage.getItem(salvosKey)) || [];
        setIsSaved(savedIds.includes(foundPost.id));
      }
    } else {
      alert("Anúncio não encontrado.");
      navigate("/home");
    }
  }, [id, navigate]);

  const handleSave = () => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!loggedUser) {
      alert("Você precisa estar logado para salvar anúncios.");
      return;
    }
    const salvosKey = `salvos_${loggedUser.email}`;
    const savedIds = JSON.parse(localStorage.getItem(salvosKey)) || [];
    if (savedIds.includes(post.id)) {
      const newSavedIds = savedIds.filter((item) => item !== post.id);
      localStorage.setItem(salvosKey, JSON.stringify(newSavedIds));
      setIsSaved(false);
      alert("Anúncio removido dos salvos!");
    } else {
      savedIds.push(post.id);
      localStorage.setItem(salvosKey, JSON.stringify(savedIds));
      setIsSaved(true);
      alert("Anúncio salvo!");
    }
  };

  const handleBuy = () => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!loggedUser) {
      alert("Você precisa estar logado para comprar.");
      return;
    }
    const notificacoesKey = `notificacoes_${post.usuario}`;
    const notificacoes = JSON.parse(localStorage.getItem(notificacoesKey)) || [];
    notificacoes.push({
      message: `O usuário ${loggedUser.apelido} comprou seu entulho: ${post.titulo}.`,
      timestamp: new Date().toISOString(),
      postId: post.id,
    });
    localStorage.setItem(notificacoesKey, JSON.stringify(notificacoes));
    alert("Compra realizada! O anunciante foi notificado.");
  };

  const handleSolicitar = () => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!loggedUser) {
      alert("Você precisa estar logado para solicitar doação.");
      return;
    }
    const notificacoesKey = `notificacoes_${post.usuario}`;
    const notificacoes = JSON.parse(localStorage.getItem(notificacoesKey)) || [];
    notificacoes.push({
      message: `O usuário ${loggedUser.apelido} solicitou a doação do entulho: ${post.titulo}.`,
      timestamp: new Date().toISOString(),
      postId: post.id,
    });
    localStorage.setItem(notificacoesKey, JSON.stringify(notificacoes));
    alert("Solicitação enviada! O anunciante foi notificado.");
  };

  const handleOpenChat = () => {
    const loggedUser = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!loggedUser) {
      alert("Você precisa estar logado para iniciar um chat.");
      return;
    }
    navigate("/mensagens");
  };

  if (!post) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Voltar
      </button>

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Layout em colunas: Imagens à esquerda, infos e ações à direita */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Coluna das Imagens */}
          <div className="md:w-2/3">
            {post.imagens && post.imagens.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {post.imagens.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${post.titulo} ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Coluna de Informações e Ações */}
          <div className="md:w-1/3 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{post.titulo}</h1>
              {post.preco && (
                <p className="text-green-700 text-3xl font-semibold mb-4">
                  {post.preco}
                </p>
              )}
              {post.volume && (
                <p className="text-gray-800 mb-2">
                  <strong>Volume:</strong> {post.volume}
                </p>
              )}
              {post.detalhesTipo && (
                <p className="text-gray-800 mb-2">
                  <strong>Detalhes:</strong> {post.detalhesTipo}
                </p>
              )}
              <p className="text-gray-800 mb-2">
                <strong>Localização:</strong> {post.localizacao}
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Contato:</strong> {post.contato}
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Tipo de Entulho:</strong> {post.categoria}
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Modalidade:</strong> {post.transacao === "venda" ? "Venda" : "Doação"}
              </p>
              <p className="text-gray-800 mb-4">
                <strong>Data de postagem:</strong>{" "}
                {post.dataPublicacao
                  ? new Date(post.dataPublicacao).toLocaleString()
                  : "Não disponível"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleOpenChat}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Abrir Chat
              </button>
              {post.transacao === "venda" ? (
                <button
                  onClick={handleBuy}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Comprar
                </button>
              ) : (
                <button
                  onClick={handleSolicitar}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Solicitar
                </button>
              )}
              <button
                onClick={handleSave}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                {isSaved ? "Remover dos Salvos" : "Salvar Anúncio"}
              </button>
            </div>
          </div>
        </div>

        {/* Descrição Completa */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Descrição</h2>
          <p className="text-gray-700">{post.descricao}</p>
        </div>

        {/* Mapa */}
        {post.localizacao && (
          <div className="mt-6">
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
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detalhes;
