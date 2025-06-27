import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';
import useContentful from './hocks/useContentful';
import logo from './logo.png';
import { translations } from './config/translations';

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
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.3, ease: [0.43, 0.13, 0.23, 0.96] } }}
      />
    </motion.div>
  );
};

// Vídeo background otimizado: tenta sempre usar <video> se possível
const BackgroundVideo = ({ videoUrl, posterImage, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && posterImage && (
        <img src={posterImage} alt="Loading" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <video
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        poster={posterImage}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoadedData={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </>
  );
};

// Fallback: Vimeo iframe se não tiver URL direta (vai ser mais pesado mesmo)
const VimeoIframe = ({ vimeoId, isMobile, onLoad }) => {
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
    'quality=720p', // qualidade menor pra travar menos
    'responsive=1',
    'dnt=1',
    'playsinline=1',
    'preload=auto',
    'title=0',
    'byline=0',
    'portrait=0',
    'pip=0'
  ].join('&');

  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${videoParams}`;

  return (
    <iframe
      src={embedUrl}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      title="Background Video"
      className="absolute inset-0 w-full h-full"
      style={iframeStyle}
      loading="eager"
      importance="high"
      onLoad={onLoad}
    />
  );
};

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [showIntro, setShowIntro] = useState(true);
  const [vimeoId, setVimeoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [posterImage, setPosterImage] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoPreloaded, setVideoPreloaded] = useState(false);
  const isMobile = useIsMobile();
  const { data: homepageData } = useContentful('homepage');

  useEffect(() => {
    if (!homepageData) return;

    if (homepageData?.posterImage) {
      setPosterImage(`https:${homepageData.posterImage}`);
    }

    if (homepageData?.videoUrl) {
      if (homepageData.videoUrl.includes('.mp4')) {
        setVideoUrl(homepageData.videoUrl);
      } else {
        const match = homepageData.videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (match) setVimeoId(match[1]);
      }
    }
  }, [homepageData]);

  useEffect(() => {
    // preconnect
    const links = [
      { rel: 'preconnect', href: 'https://player.vimeo.com', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://vimeo.com' },
    ];
    links.forEach(({ rel, href, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });
    if (posterImage) new Image().src = posterImage;
    setIsVideoReady(true);
  }, [posterImage]);

  const handleMenuClick = useCallback((item) => {
    const t = translations[language];
    if (item === t.menu.directors) setActiveModal('directors');
    else if (item === t.menu.music) setActiveModal('music');
    else if (item === t.menu.ai) setActiveModal('ai');
    else if (item === t.menu.contact) setActiveModal('contact');
  }, [language]);

  const handleCloseModal = useCallback(() => setActiveModal(null), []);
  const handleLogoClick = useCallback(() => setActiveModal(null), []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Background: prefere <video>, senão Vimeo */}
      {isVideoReady && (
        <div className="absolute inset-0 w-full h-full">
          {videoUrl ? (
            <BackgroundVideo videoUrl={videoUrl} posterImage={posterImage} onLoad={() => setVideoPreloaded(true)} />
          ) : vimeoId ? (
            <VimeoIframe vimeoId={vimeoId} isMobile={isMobile} onLoad={() => setVideoPreloaded(true)} />
          ) : null}
        </div>
      )}

      <AnimatePresence>
        {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <motion.div className="relative z-10 h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <Logo onClick={handleLogoClick} />
          {!activeModal && <LanguageSwitcher language={language} onChange={setLanguage} />}
          <Menu onItemClick={handleMenuClick} language={language} />
          <Suspense fallback={null}>
            {activeModal === 'directors' && (
              <Modal isOpen onClose={handleCloseModal} direction="left">
                <DirectorsSection language={language} />
              </Modal>
            )}
            {activeModal === 'music' && (
              <Modal isOpen onClose={handleCloseModal} direction="right">
                <MusicSection language={language} />
              </Modal>
            )}
            {activeModal === 'ai' && (
              <Modal isOpen onClose={handleCloseModal} direction="left">
                <AISection language={language} />
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
