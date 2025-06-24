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
    const frame = requestAnimationFrame(onAnimationComplete);
    return () => cancelAnimationFrame(frame);
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

const OptimizedVideo = ({ vimeoId, isMobile }) => {
  const iframeStyle = isMobile
    ? { position: 'absolute', top: '50%', left: '60%', width: '600vw', height: '400vh', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }
    : { position: 'absolute', top: '50%', left: '50%', width: '100vw', height: '100vh', transform: 'translate(-50%, -50%) scale(1.5)', pointerEvents: 'none' };

  if (!vimeoId) return <div className="w-full h-full bg-black" />;

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
    'preload=auto',
    'speed=1'
  ].join('&');

  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${videoParams}`;

  return (
    <iframe
      src={embedUrl}
      frameBorder="0"
      allow="autoplay; picture-in-picture"
      allowFullScreen
      title="Background Video"
      className="absolute inset-0 w-full h-full transition-opacity opacity-100"
      style={iframeStyle}
      loading="eager"
      importance="high"
    />
  );
};

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [vimeoId, setVimeoId] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const isMobile = useIsMobile();
  const { data: homepageData } = useContentful('homepage');

  useEffect(() => {
    if (!homepageData) return;
    const rawVideoSource = homepageData?.videoUrl || (homepageData?.backgroundVideo ? `https:${homepageData.backgroundVideo}` : null);
    const match = rawVideoSource?.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match) setVimeoId(match[1]);
  }, [homepageData]);

  useEffect(() => {
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
    setTimeout(() => setIsAppReady(true), 50);
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
      {vimeoId && isAppReady && (
        <div className="absolute inset-0 w-full h-full">
          <OptimizedVideo vimeoId={vimeoId} isMobile={isMobile} />
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
          transition={{ duration: 0.5, delay: 0.1 }}
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
