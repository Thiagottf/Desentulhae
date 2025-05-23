import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home.jsx'
import Blog from './pages/Blog.jsx'
import DetalhesBlog from './pages/DetalhesBlog.jsx'
import Relatorios from './pages/Relatorios.jsx'
import PublicarEntulho from './pages/PublicarEntulho.jsx'
import PublicarBlog from './pages/PublicarBlog.jsx'
import BuscarEntulho from './pages/BuscarEntulho.jsx'
import Detalhes from './pages/Detalhes.jsx'
import PainelUsuario from './pages/PainelUsuario.jsx'
import EditarAnuncio from './pages/EditarAnuncio.jsx'
import Chat from './pages/Chat.jsx'
import Salvos from './pages/Salvos.jsx'
import MapaInterativo from './pages/MapaInterativo.jsx'
import Notificacoes from './pages/Notificacoes.jsx'
import ReportarEntulho from './pages/ReportarEntulho.jsx'
import MapaReportados from './pages/MapaReportados.jsx'
import MobileNavbar from './components/MobileNavbar.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

// Protege rotas privadas usando o contexto de autenticação
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen">
          <Header />
          <Routes>
            {/* Redirecionamento da raiz para /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            {/* Rotas públicas */}
            <Route path="/home" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<DetalhesBlog />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/buscar" element={<BuscarEntulho />} />
            <Route path="/detalhes/:id" element={<Detalhes />} />
            {/* Rotas privadas */}
            <Route
              path="/publicar-entulho"
              element={<PrivateRoute><PublicarEntulho /></PrivateRoute>}
            />
            <Route
              path="/publicar-blog"
              element={<PrivateRoute><PublicarBlog /></PrivateRoute>}
            />
            <Route
              path="/painelusuario"
              element={<PrivateRoute><PainelUsuario /></PrivateRoute>}
            />
            <Route
              path="/editar/:id"
              element={<PrivateRoute><EditarAnuncio /></PrivateRoute>}
            />
            <Route
              path="/mensagens/:id"
              element={<PrivateRoute><Chat /></PrivateRoute>}
            />
            <Route
              path="/salvo"
              element={<PrivateRoute><Salvos /></PrivateRoute>}
            />
            <Route
              path="/mapa"
              element={<PrivateRoute><MapaInterativo /></PrivateRoute>}
            />
            <Route
              path="/notificacoes"
              element={<PrivateRoute><Notificacoes /></PrivateRoute>}
            />
            <Route
              path="/reportar-entulho"
              element={<PrivateRoute><ReportarEntulho /></PrivateRoute>}
            />
            <Route
              path="/mapa-reportados"
              element={<PrivateRoute><MapaReportados /></PrivateRoute>}
            />
            {/* Fallback para rotas não existentes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <MobileNavbar />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
