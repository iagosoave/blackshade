import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes
import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';

// Páginas
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DirectorsPage from './pages/DirectorsPage';
import DirectorDetailPage from './pages/DirectorDetailPage';
import CosmosPage from './pages/CosmosPage';
import ContactPage from './pages/ContactPage';

// Imagens
import logo from './logo.png';

// Traduções
import { translations } from './config/translations';

// Componente de Animação de Introdução
const IntroAnimation = ({ onAnimationComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onAnimationComplete, 2500);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      exit={{ x: '-100%', transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.img
        src={logo}
        alt="BLACKSHADE"
        className="h-24 md:h-32"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.8,
            delay: 0.3,
            ease: [0.43, 0.13, 0.23, 0.96]
          }
        }}
      />
    </motion.div>
  );
};

// Componente de Layout Principal
function AppLayout({ children }) {
  const [language, setLanguage] = useState('pt');
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se está em uma página de detalhe de diretor
  const isDirectorDetail = location.pathname.startsWith('/diretores/');
  const isHomePage = location.pathname === '/';

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleMenuClick = useCallback((item) => {
    const t = translations[language];
    
    if (item === t.menu.about) navigate('/sobre');
    else if (item === t.menu.directors) navigate('/diretores');
    else if (item === t.menu.cosmos) navigate('/cosmos');
    else if (item === t.menu.contact) navigate('/contato');
  }, [language, navigate]);

  // Determina o modal ativo baseado na rota
  const getActiveModal = () => {
    const path = location.pathname;
    if (path === '/sobre') return 'about';
    if (path.startsWith('/diretores')) return 'directors';
    if (path === '/cosmos') return 'cosmos';
    if (path === '/contato') return 'contact';
    return null;
  };

  return (
    <>
      {/* Animação de Introdução */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      {!showIntro && (
        <motion.div
          className="relative z-10 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo - Sempre visível exceto no portfolio de diretores */}
          {!isDirectorDetail && <Logo onClick={handleLogoClick} />}

          {/* Language Switcher - Apenas na home */}
          {isHomePage && (
            <LanguageSwitcher language={language} onChange={setLanguage} />
          )}

          {/* Menu - Esconde apenas no portfolio de diretores */}
          {!isDirectorDetail && (
            <Menu
              onItemClick={handleMenuClick}
              language={language}
              activeModal={getActiveModal()}
            />
          )}

          {/* Renderiza as páginas com animação */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {React.cloneElement(children, { language })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}

// Componente Principal da Aplicação
export default function App() {
  return (
    <Router>
      <div className="fixed inset-0 overflow-hidden bg-black">
        <Routes>
          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/sobre" element={<AppLayout><AboutPage /></AppLayout>} />
          <Route path="/diretores" element={<AppLayout><DirectorsPage /></AppLayout>} />
          <Route path="/diretores/:directorId" element={<AppLayout><DirectorDetailPage /></AppLayout>} />
          <Route path="/cosmos" element={<AppLayout><CosmosPage /></AppLayout>} />
          <Route path="/contato" element={<AppLayout><ContactPage /></AppLayout>} />
        </Routes>
      </div>
    </Router>
  );
}