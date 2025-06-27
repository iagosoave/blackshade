import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';
import useContentful from './hocks/useContentful';
import logo from './logo.png';
import backgroundVideo from './video.mp4'; // vídeo local
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

const BackgroundVideo = ({ posterImage, onLoad }) => {
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
        <source src={backgroundVideo} type="video/mp4" />
      </video>
    </>
  );
};

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [showIntro, setShowIntro] = useState(true);
  const [posterImage, setPosterImage] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoPreloaded, setVideoPreloaded] = useState(false);
  const isMobile = useIsMobile();
  const { data: homepageData } = useContentful('homepage');

  useEffect(() => {
    if (homepageData?.posterImage) {
      setPosterImage(`https:${homepageData.posterImage}`);
    }
    setIsVideoReady(true);
  }, [homepageData]);

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
      {isVideoReady && (
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo posterImage={posterImage} onLoad={() => setVideoPreloaded(true)} />
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
