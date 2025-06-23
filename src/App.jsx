import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';
import DirectorsSection from './sections/DirectorsSection';
import MusicSection from './sections/MusicSection';
import AISection from './sections/AISection';
import ContactSection from './sections/ContactSection';
import useContentful from './hocks/useContentful';
import logo from './logo.png';

// --- Hook para detectar se a tela é de mobile ---
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

// --- Animação de Intro (Corrigida) ---
const IntroAnimation = ({ onAnimationComplete }) => {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.img
        src={logo}
        alt="Logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        onAnimationComplete={onAnimationComplete} // Callback de conclusão foi movido para a animação real
      />
    </motion.div>
  );
};

// --- Componente de Vídeo Otimizado (Corrigido) ---
const OptimizedVideo = ({ vimeoId, isMobile, isReady }) => {
  // Container que controla a visibilidade e o posicionamento de fundo
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // Garante que o vídeo fique no fundo de todo o conteúdo
    opacity: isReady ? 1 : 0,
    transition: 'opacity 0.7s ease-in-out',
    backgroundColor: 'black',
    overflow: 'hidden', // Previne barras de rolagem
  };

  const iframeStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: isMobile ? '300vw' : '150vw',
    height: isMobile ? '300vh' : '150vh',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  };

  const videoParams = [
    'autoplay=1', 'loop=1', 'autopause=0', 'muted=1', 'background=1',
    'controls=0', 'sidedock=0', 'quality=auto', 'dnt=1', 'playsinline=1'
  ].join('&');

  const embedUrl = vimeoId ? `https://player.vimeo.com/video/${vimeoId}?${videoParams}` : '';

  return (
    <div style={containerStyle}>
      {vimeoId && (
        <iframe
          src={embedUrl}
          frameBorder="0"
          allow="autoplay; picture-in-picture"
          allowFullScreen
          title="Background Video"
          style={iframeStyle}
          loading="eager" // Prioriza o carregamento do iframe
        />
      )}
    </div>
  );
};

// --- Componente Principal (Corrigido) ---
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [vimeoId, setVimeoId] = useState(null);

  const isMobile = useIsMobile();
  const { data: homepageData } = useContentful('homepage');

  // Extrai o ID do Vimeo assim que os dados chegarem
  useEffect(() => {
    if (!homepageData) return;
    const rawVideoSource = homepageData?.videoUrl || (homepageData?.backgroundVideo ? `https:${homepageData.backgroundVideo}` : null);
    if (rawVideoSource) {
      const match = rawVideoSource.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match) setVimeoId(match[1]);
    }
  }, [homepageData]);

  // Adiciona tags de preconnect para acelerar a conexão com o Vimeo
  useEffect(() => {
    const links = [
      { rel: 'preconnect', href: 'https://player.vimeo.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://f.vimeocdn.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://i.vimeocdn.com', crossOrigin: 'anonymous' }
    ];
    links.forEach(({ rel, href, crossOrigin }) => {
      if (document.querySelector(`link[href="${href}"]`)) return; // Evita duplicados
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });
  }, []);

  // Callback para finalizar a introdução
  const handleAnimationComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleMenuClick = useCallback((item) => {
    const normalizedItem = item.toLowerCase();
    if (normalizedItem.includes('diretor')) setActiveModal('directors');
    else if (normalizedItem.includes('música')) setActiveModal('music');
    else if (normalizedItem.includes('ia')) setActiveModal('ai');
    else if (normalizedItem.includes('contat')) setActiveModal('contact');
  }, []);

  const handleCloseModal = useCallback(() => setActiveModal(null), []);
  const handleLogoClick = useCallback(() => setActiveModal(null), []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* O vídeo é renderizado imediatamente e sua visibilidade é controlada pelo `isReady` prop */}
      <OptimizedVideo
        vimeoId={vimeoId}
        isMobile={isMobile}
        isReady={!showIntro && !!vimeoId}
      />

      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onAnimationComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>

      {/* O conteúdo principal só é renderizado após a introdução */}
      {!showIntro && (
        <motion.div
          className="relative z-10 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo onClick={handleLogoClick} />
          {!activeModal && !isVideoOpen && (
            <LanguageSwitcher language={language} onChange={setLanguage} />
          )}
          {!isVideoOpen && (
            <Menu onItemClick={handleMenuClick} language={language} />
          )}

          <Modal isOpen={activeModal === 'directors'} onClose={handleCloseModal} direction="left">
            <DirectorsSection language={language} onVideoOpen={setIsVideoOpen} />
          </Modal>
          <Modal isOpen={activeModal === 'music'} onClose={handleCloseModal} direction="right">
            <MusicSection language={language} onVideoOpen={setIsVideoOpen} />
          </Modal>
          <Modal isOpen={activeModal === 'ai'} onClose={handleCloseModal} direction="left">
            <AISection language={language} onVideoOpen={setIsVideoOpen} />
          </Modal>
          <Modal isOpen={activeModal === 'contact'} onClose={handleCloseModal} direction="right">
            <ContactSection language={language} />
          </Modal>
        </motion.div>
      )}
    </div>
  );
}