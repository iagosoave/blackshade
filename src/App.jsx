// src/App.jsx

// ... outras importações ...
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
  // ... (código inalterado)
};

// --- Animação de Intro ---
const IntroAnimation = ({ onAnimationComplete }) => {
  // ... (código inalterado)
};

// --- Componente de Vídeo Otimizado ---
const OptimizedVideo = ({ vimeoId, isMobile, isReady }) => {
  const iframeStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: isMobile ? '300vw' : '150vw', // Aumentado para garantir cobertura total
    height: isMobile ? '300vh' : '150vh',// Aumentado para garantir cobertura total
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: isReady ? 1 : 0, // Controla a visibilidade
    transition: 'opacity 0.5s ease-in-out',
  };

  if (!vimeoId) {
    return <div className="w-full h-full bg-black" />;
  }

  const videoParams = [
    'autoplay=1', 'loop=1', 'autopause=0', 'muted=1', 'background=1',
    'controls=0', 'sidedock=0', 'quality=auto', 'dnt=1', 'playsinline=1'
  ].join('&');

  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${videoParams}`;

  return (
    <iframe
      src={embedUrl}
      frameBorder="0"
      allow="autoplay; picture-in-picture"
      allowFullScreen
      title="Background Video"
      style={iframeStyle}
      loading="eager" // Carregamento imediato
    />
  );
};

// --- Componente Principal ---
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [vimeoId, setVimeoId] = useState(null);

  const isMobile = useIsMobile();
  const { data: homepageData } = useContentful('homepage');

  // Extrai o ID do Vimeo
  useEffect(() => {
    if (!homepageData) return;
    const rawVideoSource = homepageData?.videoUrl || (homepageData?.backgroundVideo ? `https:${homepageData.backgroundVideo}` : null);
    if (rawVideoSource) {
      const match = rawVideoSource.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match) setVimeoId(match[1]);
    }
  }, [homepageData]);

  // Preconnect com Vimeo
  useEffect(() => {
    const links = [
      { rel: 'preconnect', href: 'https://player.vimeo.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://f.vimeocdn.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://i.vimeocdn.com', crossOrigin: 'anonymous' }
    ];
    links.forEach(({ rel, href, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  // ... (outros handlers inalterados) ...
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
      {/* Renderiza o vídeo imediatamente e controla a visibilidade com `!showIntro` */}
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