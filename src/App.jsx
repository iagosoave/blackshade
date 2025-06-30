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

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { data: homepageData } = useContentful('homepage');

  const handleMenuClick = useCallback((item) => {
    const t = translations[language];
    if (item === t.menu.directors) setActiveModal('directors');
    else if (item === t.menu.music) setActiveModal('music');
    else if (item === t.menu.ai) setActiveModal('ai');
    else if (item === t.menu.contact) setActiveModal('contact');
  }, [language]);

  const handleCloseModal = useCallback(() => setActiveModal(null), []);
  
  const handleLogoClick = useCallback(() => {
    setActiveModal(null);
    setIsVideoOpen(false);
  }, []);

  // Pega a URL do vídeo e poster do Contentful
  const videoUrl = homepageData?.videoUrl || null;
  const posterImage = homepageData?.posterImage ? `https:${homepageData.posterImage}` : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Vídeo de Background - Simples */}
      {videoUrl && (
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={posterImage}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
      
      {/* Se não tiver vídeo mas tiver poster, mostra a imagem */}
      {!videoUrl && posterImage && (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={posterImage} 
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
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