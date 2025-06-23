import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Importe seus componentes e hooks
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
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

// --- Animação de Intro OTIMIZADA ---
const IntroAnimation = ({ onAnimationComplete }) => {
  useEffect(() => {
    // Reduz o tempo da intro para 1.5s (era 2.5s)
    const timer = setTimeout(onAnimationComplete, 1500);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      exit={{ x: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.img
        src={logo}
        alt="BLACKSHADE"
        className="h-24 md:h-32"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } }}
      />
    </motion.div>
  );
};

// --- Componente de Vídeo ULTRA OTIMIZADO ---
const OptimizedVideo = ({ vimeoId, isMobile }) => {
  const [videoState, setVideoState] = useState('loading');
  
  // Estilos do iframe
  const iframeStyle = isMobile ? {
    position: 'absolute',
    top: '50%',
    left: '60%',
    width: '600vw',
    height: '400vh',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  } : {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100vw',
    height: '100vh',
    transform: 'translate(-50%, -50%) scale(1.5)',
    pointerEvents: 'none',
  };

  if (!vimeoId) {
    return (
      <div className="w-full h-full bg-black" />
    );
  }

  // Parâmetros otimizados para carregamento instantâneo
  const videoParams = [
    'autoplay=1',
    'loop=1',
    'autopause=0',
    'muted=1',
    'background=1',
    'controls=0',
    'sidedock=0',
    'quality=auto',
    'responsive=1',
    'dnt=1',
    'playsinline=1',
    'preload=auto', // Força preload
    'speed=1' // Previne alterações de velocidade
  ].join('&');
  
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${videoParams}`;

  return (
    <>
      {/* Não mostrar loading - vai direto para o vídeo */}
      <iframe
        src={embedUrl}
        frameBorder="0"
        allow="autoplay; picture-in-picture"
        allowFullScreen
        title="Background Video"
        className={`transition-opacity duration-300 ${
          videoState === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
        style={iframeStyle}
        onLoad={() => setVideoState('ready')}
        importance="high"
        loading="eager" // Força carregamento imediato
      />
    </>
  );
};

// --- Componente Principal OTIMIZADO ---
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [vimeoId, setVimeoId] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);

  const isMobile = useIsMobile();
  
  // Carrega dados do Contentful com prioridade
  const { data: homepageData } = useContentful('homepage');
  
  // Extrai o ID do Vimeo assim que os dados chegarem
  useEffect(() => {
    if (!homepageData) return;

    const rawVideoSource = homepageData?.videoUrl || 
      (homepageData?.backgroundVideo ? `https:${homepageData.backgroundVideo}` : null);
    
    if (rawVideoSource) {
      // Regex otimizada para extrair ID do Vimeo
      const match = rawVideoSource.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match) {
        setVimeoId(match[1]);
      }
    }
  }, [homepageData]);

  // Preconnect e prefetch para Vimeo - CRÍTICO para performance
  useEffect(() => {
    // Preconnect com alta prioridade
    const links = [
      { rel: 'preconnect', href: 'https://player.vimeo.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://f.vimeocdn.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://i.vimeocdn.com', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://vimeo.com' },
      { rel: 'dns-prefetch', href: 'https://vimeocdn.com' }
    ];

    links.forEach(({ rel, href, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });

    // Marca app como pronto após um delay mínimo
    setTimeout(() => setIsAppReady(true), 100);
  }, []);

  // Callbacks otimizados
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
      {/* Renderiza o vídeo imediatamente, mesmo durante a intro */}
      {vimeoId && isAppReady && (
        <div className="absolute inset-0 w-full h-full">
          <OptimizedVideo 
            vimeoId={vimeoId}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Animação de Introdução */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation 
            onAnimationComplete={() => setShowIntro(false)} 
          />
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      {!showIntro && (
        <motion.div
          className="relative z-10 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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