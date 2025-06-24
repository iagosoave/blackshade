import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';
import useContentful from './hocks/useContentful';
import logo from './logo.png';

const DirectorsSection = lazy(() => import('./sections/DirectorsSection'));
const MusicSection = lazy(() => import('./sections/MusicSection'));
const AISection = lazy(() => import('./sections/AISection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
};

const IntroAnimation = ({ onAnimationComplete }) => {
  useEffect(() => {
    // Aguarda 2.5 segundos antes de completar a animação
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

const OptimizedVideo = ({ vimeoId, isMobile, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const iframeStyle = isMobile
    ? { position: 'absolute', top: '50%', left: '60%', width: '600vw', height: '400vh', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }
    : { position: 'absolute', top: '50%', left: '50%', width: '100vw', height: '100vh', transform: 'translate(-50%, -50%) scale(1.5)', pointerEvents: 'none' };

  if (!vimeoId) return <div className="w-full h-full bg-black" />;

  // Parâmetros otimizados para carregamento mais rápido
  const videoParams = [
    'autoplay=1',
    'loop=1',
    'autopause=0',
    'muted=1',
    'background=1',
    'controls=0',
    'sidedock=0',
    'quality=540p', // Força qualidade específica para carregar mais rápido
    'responsive=1',
    'dnt=1',
    'playsinline=1',
    'preload=auto',
    'speed=1',
    'title=0',
    'byline=0',
    'portrait=0',
    'pip=0'
  ].join('&');

  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${videoParams}`;

  useEffect(() => {
    // Pré-carrega o player do Vimeo
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'document';
    link.href = embedUrl;
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [embedUrl]);

  return (
    <>
      {/* Placeholder preto enquanto carrega */}
      {!isLoaded && <div className="absolute inset-0 bg-black" />}
      
      <iframe
        src={embedUrl}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Background Video"
        className={`absolute inset-0 w-full h-full transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={iframeStyle}
        loading="eager"
        importance="high"
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
      />
    </>
  );
};

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  // ID de vídeo padrão hardcoded para carregar instantaneamente
  const [vimeoId, setVimeoId] = useState('YOUR_DEFAULT_VIDEO_ID'); // SUBSTITUA pelo ID real do vídeo
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoPreloaded, setVideoPreloaded] = useState(false);
  const isMobile = useIsMobile();
  const { data: homepageData } = useContentful('homepage');

  useEffect(() => {
    if (!homepageData) return;
    const rawVideoSource = homepageData?.videoUrl || (homepageData?.backgroundVideo ? `https:${homepageData.backgroundVideo}` : null);
    const match = rawVideoSource?.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match && match[1] !== vimeoId) {
      setVimeoId(match[1]);
      
      // Pré-carrega o thumbnail do vídeo
      const thumbnailUrl = `https://vumbnail.com/${match[1]}.jpg`;
      const img = new Image();
      img.src = thumbnailUrl;
    }
  }, [homepageData, vimeoId]);

  useEffect(() => {
    // Preconnects mais agressivos
    const links = [
      { rel: 'preconnect', href: 'https://player.vimeo.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://f.vimeocdn.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://i.vimeocdn.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://vod-progressive.akamaized.net', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://vod-adaptive.akamaized.net', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://vimeo.com' },
      { rel: 'dns-prefetch', href: 'https://vimeocdn.com' },
      { rel: 'dns-prefetch', href: 'https://akamaized.net' }
    ];
    
    links.forEach(({ rel, href, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });
    
    // Pré-carrega o script do player Vimeo
    const script = document.createElement('link');
    script.rel = 'preload';
    script.as = 'script';
    script.href = 'https://player.vimeo.com/api/player.js';
    document.head.appendChild(script);
    
    setIsVideoReady(true);
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
      {/* Vídeo carrega imediatamente, mas fica escondido atrás da animação intro */}
      {vimeoId && isVideoReady && (
        <div className="absolute inset-0 w-full h-full">
          <OptimizedVideo 
            vimeoId={vimeoId} 
            isMobile={isMobile}
            onLoad={() => setVideoPreloaded(true)}
          />
        </div>
      )}

      <AnimatePresence>
        {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          className="relative z-10 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Logo onClick={handleLogoClick} />
          {!activeModal && !isVideoOpen && <LanguageSwitcher language={language} onChange={setLanguage} />}
          {!isVideoOpen && <Menu onItemClick={handleMenuClick} language={language} />}

          <Suspense fallback={null}>
            {activeModal === 'directors' && (
              <Modal isOpen onClose={handleCloseModal} direction="left">
                <DirectorsSection language={language} onVideoOpen={setIsVideoOpen} />
              </Modal>
            )}
            {activeModal === 'music' && (
              <Modal isOpen onClose={handleCloseModal} direction="right">
                <MusicSection language={language} onVideoOpen={setIsVideoOpen} />
              </Modal>
            )}
            {activeModal === 'ai' && (
              <Modal isOpen onClose={handleCloseModal} direction="left">
                <AISection language={language} onVideoOpen={setIsVideoOpen} />
              </Modal>
            )}
            {activeModal === 'contact' && (
              <Modal isOpen onClose={handleCloseModal} direction="right">
                <ContactSection language={language} />
              </Modal>
            )}
          </Suspense>
        </motion.div>
      )}
    </div>
  );
}