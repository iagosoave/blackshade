import React, { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';
// import useContentful from './hocks/useContentful'; // Não é mais necessário para o vídeo de fundo
import logo from './logo.png';
import { translations } from './config/translations';

// Importe o vídeo diretamente
import backgroundVideo from './video.mp4'; 

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
  // const { data: homepageData } = useContentful('homepage'); // Removido
  const videoRef = useRef(null);

  // Força o play do vídeo após carregar
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      const playVideo = () => {
        videoRef.current.play().catch(err => {
          console.log('Autoplay prevented:', err);
          // Tenta novamente após interação do usuário
          document.addEventListener('click', () => {
            videoRef.current.play();
          }, { once: true });
        });
      };
      
      // Tenta tocar quando o vídeo estiver pronto
      if (videoRef.current.readyState >= 3) {
        playVideo();
      } else {
        videoRef.current.addEventListener('loadeddata', playVideo);
      }
    }
  }, []); // Dependência 'homepageData' removida, pois não é mais usada para o vídeo de fundo

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

  // Agora, o vídeo de fundo sempre será 'video.mp4'
  const videoSource = backgroundVideo; 

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Vídeo de Background - MP4 direto */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* Usa o 'videoSource' que aponta para 'video.mp4' */}
          <source src={videoSource} type="video/mp4" />
        </video>
      </div>

      {/* Os blocos de vídeo do Vimeo foram removidos, pois não serão mais usados para o background */}

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