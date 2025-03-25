import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro'
import PublicarEntulho from './pages/PublicarEntulho.jsx'
import Home from './pages/Home.jsx'
import BuscarEntulho from './pages/BuscarEntulho.jsx'
import Detalhes from './pages/Detalhes.jsx'
import PainelUsuario from './pages/PainelUsuario.jsx'
import EditarAnuncio from './pages/EditarAnuncio.jsx'
import Chat from './pages/Chat.jsx'
import Salvo from './pages/Salvos.jsx'
import Mapa from './pages/MapaInterativo.jsx'
import Notificacoes from './pages/Notificacoes.jsx'
import MobileNavbar from './components/MobileNavbar.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx' 

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
      <Header />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/publicar-entulho" element={<PublicarEntulho />} />
          <Route path="/buscar" element={<BuscarEntulho />} />
          <Route path="/detalhes/:id" element={<Detalhes />} />
          <Route path="/painelusuario" element={<PainelUsuario />} />
          <Route path="/editar/:id" element={<EditarAnuncio />} />
          <Route path="/mensagens" element={<Chat />} />
          <Route path="/salvo" element={<Salvo />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
        </Routes>
        <MobileNavbar />
      <Footer />
      </div>
    </Router>
  )
}

export default App
