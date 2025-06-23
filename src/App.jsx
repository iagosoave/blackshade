import React from 'react';
import { useState, useEffect } from 'react';
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

// --- Animação de Intro (Deslizar para a Esquerda) ---
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.5 } }}
      />
    </motion.div>
  );
};

// --- Componente de Vídeo Otimizado ---
const OptimizedVideo = ({ vimeoEmbedUrl, isMobile, loading }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Estilos condicionais
  const desktopStyle = {
    top: '50%',
    left: '50%',
    width: '100vw',
    height: '100vh',
    transform: 'translate(-50%, -50%) scale(1.5)',
    pointerEvents: 'none',
  };

  const mobileStyle = {
    top: '50%',
    left: '60%',
    width: '600vw',
    height: '400vh',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  };
  
  const iframeStyle = isMobile ? mobileStyle : desktopStyle;

  if (!vimeoEmbedUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white bg-black">
        <p>{loading ? "Carregando..." : "Vídeo não disponível."}</p>
      </div>
    );
  }

  return (
    <>
      {/* Placeholder enquanto o vídeo carrega */}
      {!videoLoaded && !videoError && (
        <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
          <div className="text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-sm opacity-75">Carregando vídeo...</p>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {videoError && (
        <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
          <p className="text-white text-sm opacity-75">Erro ao carregar o vídeo</p>
        </div>
      )}

      {/* Iframe do vídeo */}
      <iframe
        src={vimeoEmbedUrl}
        frameBorder="0"
        allow="autoplay; picture-in-picture"
        title="Background Video"
        className={`absolute transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={iframeStyle}
        onLoad={() => setVideoLoaded(true)}
        onError={() => setVideoError(true)}
      />
    </>
  );
};

// --- Componente Principal da Aplicação ---
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [vimeoEmbedUrl, setVimeoEmbedUrl] = useState(null);

  const isMobile = useIsMobile();
  const { data: homepageData, loading } = useContentful('homepage');
  
  // Funções de manipulação
  const handleMenuClick = (item) => {
    const normalizedItem = item.toLowerCase();
    if (normalizedItem.includes('diretor')) setActiveModal('directors');
    else if (normalizedItem.includes('música')) setActiveModal('music');
    else if (normalizedItem.includes('ia')) setActiveModal('ai');
    else if (normalizedItem.includes('contat')) setActiveModal('contact');
  };
  const handleCloseModal = () => setActiveModal(null);
  const handleLogoClick = () => setActiveModal(null);
  const getVimeoId = (url) => {
    if (!url) return null;
    const regex = /(?:vimeo\.com\/(?:[^\/]+\/)*|video\/|)(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Processamento da URL do vídeo com otimizações
  useEffect(() => {
    if (!homepageData) return;

    const rawVideoSource = homepageData?.videoUrl || 
      (homepageData?.backgroundVideo ? `https:${homepageData.backgroundVideo}` : null);
    
    if (rawVideoSource) {
      const vimeoId = getVimeoId(rawVideoSource);
      if (vimeoId) {
        try {
          const urlObj = new URL(rawVideoSource);
          const hashParam = urlObj.searchParams.get('h') ? `&h=${urlObj.searchParams.get('h')}` : '';
          
          // Parâmetros otimizados para carregamento mais rápido
          const optimizedParams = [
            'autoplay=1',
            'loop=1',
            'autopause=0',
            'muted=1',
            'background=1',
            'controls=0',
            'sidedock=0',
            'quality=auto', // Qualidade automática baseada na conexão
            'responsive=1', // Adapta à viewport
            'dnt=1', // Não rastrear (pode melhorar performance)
            'playsinline=1' // Importante para mobile
          ].join('&');
          
          const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${optimizedParams}${hashParam}`;
          setVimeoEmbedUrl(embedUrl);
        } catch (e) {
          console.error("URL do Vimeo inválida", e);
        }
      }
    }
  }, [homepageData]);

  // Preconnect para domínios do Vimeo
  useEffect(() => {
    const preconnectLinks = [
      'https://player.vimeo.com',
      'https://f.vimeocdn.com',
      'https://i.vimeocdn.com'
    ];

    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // DNS prefetch como fallback
    const dnsPrefetchLink = document.createElement('link');
    dnsPrefetchLink.rel = 'dns-prefetch';
    dnsPrefetchLink.href = 'https://vimeo.com';
    document.head.appendChild(dnsPrefetchLink);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Container do Vídeo de Fundo */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedVideo 
          vimeoEmbedUrl={vimeoEmbedUrl}
          isMobile={isMobile}
          loading={loading}
        />
      </div>

      {/* Animação de Introdução */}
      <AnimatePresence>
        {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* Conteúdo Principal (UI) */}
      {!showIntro && (
        <motion.div
          className="relative z-10 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Logo onClick={handleLogoClick} />
          {!activeModal && !isVideoOpen && <LanguageSwitcher language={language} onChange={setLanguage} />}
          {!isVideoOpen && <Menu onItemClick={handleMenuClick} language={language} />}

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