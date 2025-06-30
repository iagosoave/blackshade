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

const OptimizedVideo = ({ vimeoId, videoUrl, posterImage, isMobile, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const videoStyle = isMobile
    ? { 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        width: '177.78vh', // 16:9 aspect ratio
        height: '100vh',
        transform: 'translate(-50%, -50%)',
        objectFit: 'cover'
      }
    : { 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        width: '100%',
        height: '100%',
        minWidth: '100vw',
        minHeight: '100vh',
        transform: 'translate(-50%, -50%)',
        objectFit: 'cover'
      };

  // Se tiver URL direta do vídeo (MP4, WebM, ou Vimeo Progressive), usa ela
  if (videoUrl) {
    return (
      <>
        {!isLoaded && posterImage && (
          <img 
            src={posterImage} 
            alt="Loading"
            className="absolute inset-0 w-full h-full object-cover"
            style={videoStyle}
          />
        )}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterImage}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={videoStyle}
          onLoadedData={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </>
    );
  }

  // Fallback para iframe do Vimeo (mais lento)
  if (!vimeoId) return <div className="w-full h-full bg-black" />;

  const iframeStyle = isMobile
    ? { position: 'absolute', top: '50%', left: '60%', width: '600vw', height: '400vh', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }
    : { position: 'absolute', top: '50%', left: '50%', width: '100vw', height: '100vh', transform: 'translate(-50%, -50%) scale(1.5)', pointerEvents: 'none' };

  const videoParams = [
    'autoplay=1',
    'loop=1',
    'autopause=0',
    'muted=1',
    'background=1',
    'controls=0',
    'sidedock=0',
    'quality=1080p',
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

  return (
    <>
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
  const [vimeoId, setVimeoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [posterImage, setPosterImage] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoPreloaded, setVideoPreloaded] = useState(false);
  const isMobile = useIsMobile();
  const { data: homepageData } = useContentful('homepage');

  // EXEMPLO DE URL DIRETA DO VIMEO (substitua com a sua)
  // Para obter essa URL:
  // 1. Vá para vimeo.com e faça login
  // 2. Vá para as configurações do vídeo
  // 3. Em "Privacy" ou "Distribution", procure por "Direct file access" ou "Video file links"
  // 4. Copie o link do arquivo MP4
  const VIMEO_DIRECT_URL = 'https://player.vimeo.com/progressive_redirect/playback/SEU_VIDEO_ID/rendition/1080p/file.mp4?loc=external&oauth2_token_id=SEU_TOKEN&signature=SUA_ASSINATURA';

  useEffect(() => {
    // Define a URL direta do vídeo imediatamente se disponível
    if (VIMEO_DIRECT_URL && VIMEO_DIRECT_URL !== 'https://player.vimeo.com/progressive_redirect/playback/SEU_VIDEO_ID/rendition/1080p/file.mp4?loc=external&oauth2_token_id=SEU_TOKEN&signature=SUA_ASSINATURA') {
      setVideoUrl(VIMEO_DIRECT_URL);
    }
    
    if (!homepageData) return;
    
    // Se tiver posterImage, usa como placeholder
    if (homepageData?.posterImage) {
      setPosterImage(`https:${homepageData.posterImage}`);
    }
    
    // Se tiver videoUrl no Contentful
    if (homepageData?.videoUrl) {
      // Se for uma URL direta (progressive download ou MP4)
      if (homepageData.videoUrl.includes('progressive_redirect') || 
          homepageData.videoUrl.includes('.mp4') || 
          homepageData.videoUrl.includes('.webm')) {
        setVideoUrl(homepageData.videoUrl);
      } else {
        // Se for URL normal do Vimeo, extrai o ID
        const match = homepageData.videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (match) {
          setVimeoId(match[1]);
          // Se não tiver URL direta, usa o iframe (mais lento)
          if (!VIMEO_DIRECT_URL || VIMEO_DIRECT_URL.includes('SEU_VIDEO_ID')) {
            setVideoUrl(null);
          }
        }
      }
    }
  }, [homepageData, VIMEO_DIRECT_URL]);

  useEffect(() => {
    // Preconnects e prefetch
    const links = [
      { rel: 'preconnect', href: 'https://player.vimeo.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://vod-progressive.akamaized.net', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://vimeo.com' },
    ];
    
    links.forEach(({ rel, href, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });
    
    // Prefetch do poster se existir
    if (posterImage) {
      const img = new Image();
      img.src = posterImage;
    }
    
    setIsVideoReady(true);
  }, [posterImage]);

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
      {/* Vídeo carrega imediatamente, priorizando URL direta sobre iframe */}
      {(videoUrl || vimeoId) && isVideoReady && (
        <div className="absolute inset-0 w-full h-full">
          <OptimizedVideo 
            vimeoId={vimeoId}
            videoUrl={videoUrl}
            posterImage={posterImage}
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