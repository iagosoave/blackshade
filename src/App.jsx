import React, { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes
import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';

// Ganchos customizados
import useContentful from './hocks/useContentful';

// Imagens e Vídeos
import logo from './logo.png';
import backgroundVideo1 from './01.mp4';
import backgroundVideo2 from './02.mp4';
import backgroundVideo3 from './03.mp4';

// Traduções
import { translations } from './config/translations';

// Carregamento lazy das seções
const AboutSection = lazy(() => import('./sections/AboutSection'));
const DirectorsSection = lazy(() => import('./sections/DirectorsSection'));
const CosmosSection = lazy(() => import('./sections/CosmosSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));

// Componente de Animação de Introdução
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

// Componente Principal da Aplicação
export default function App() {
  // Estados
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isInDirectorPortfolio, setIsInDirectorPortfolio] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Array de vídeos
  const videos = [backgroundVideo1, backgroundVideo2, backgroundVideo3];

  // Ref para o vídeo atual
  const videoRef = useRef(null);

  // Dados do Contentful (se necessário)
  const { data: homepageData } = useContentful('homepage');

  // Função para avançar para o próximo vídeo
  const goToNextVideo = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, [videos.length]);

  // Efeito para configurar o vídeo atual
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.loop = false; // Desabilita loop para detectar o fim

      const playVideo = () => {
        videoElement.play().catch(err => {
          console.warn('Erro ao tentar reproduzir o vídeo automaticamente:', err);
          document.addEventListener('click', () => {
            videoElement.play().catch(e => console.error('Erro ao reproduzir vídeo após clique:', e));
          }, { once: true });
        });
      };

      // Detecta quando o vídeo termina e avança para o próximo
      const handleVideoEnd = () => {
        goToNextVideo();
      };

      videoElement.addEventListener('ended', handleVideoEnd);

      if (videoElement.readyState >= 3) {
        playVideo();
      } else {
        videoElement.addEventListener('loadeddata', playVideo);
      }

      // Cleanup
      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.removeEventListener('loadeddata', playVideo);
      };
    }
  }, [currentVideoIndex, goToNextVideo]);

  // Funções de callback
  const handleMenuClick = useCallback((item) => {
    const t = translations[language];

    let targetModal = null;
    if (item === t.menu.about) targetModal = 'about';
    else if (item === t.menu.directors) targetModal = 'directors';
    else if (item === t.menu.cosmos) targetModal = 'cosmos';
    else if (item === t.menu.contact) targetModal = 'contact';

    if (activeModal === targetModal) {
      setActiveModal(null);
      setTimeout(() => setActiveModal(targetModal), 10);
    } else {
      setActiveModal(targetModal);
    }
  }, [language, activeModal]);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
    setIsInDirectorPortfolio(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    setActiveModal(null);
    setIsVideoOpen(false);
    setIsInDirectorPortfolio(false);
  }, []);

  // Renderização
  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Vídeos de Background - Todos renderizados simultaneamente */}
      <div className="absolute inset-0 w-full h-full">
        {videos.map((video, index) => (
          <video
            key={`video-${index}`}
            ref={index === currentVideoIndex ? videoRef : null}
            autoPlay={index === currentVideoIndex}
            muted={true}
            playsInline={true}
            controls={false}
            preload="auto"
            className="absolute"
            style={{ 
              opacity: index === currentVideoIndex ? (activeModal === 'contact' ? 0.2 : 1) : 0,
              pointerEvents: 'none',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1.1)',
              minWidth: '100vw',
              minHeight: '100vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'cover',
              zIndex: index === currentVideoIndex ? 2 : 1
            }}
          >
            <source src={video} type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        ))}
      </div>



      {/* Animação de Introdução */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      {!showIntro && (
        <motion.div
          className="relative z-10 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo - Esconde quando estiver no portfolio de diretores */}
          {!isInDirectorPortfolio && <Logo onClick={handleLogoClick} />}

          {/* Language Switcher - Esconde quando estiver no portfolio de diretores */}
          {!activeModal && !isVideoOpen && !isInDirectorPortfolio && (
            <LanguageSwitcher language={language} onChange={setLanguage} />
          )}

          {/* Menu - Esconde quando estiver no portfolio de diretores */}
          {!isVideoOpen && !isInDirectorPortfolio && (
            <Menu
              onItemClick={handleMenuClick}
              language={language}
              activeModal={activeModal}
            />
          )}

          {/* Modais */}
          <Suspense fallback={null}>
            {/* Quem Somos */}
            {activeModal === 'about' && (
              <Modal isOpen onClose={handleCloseModal} direction="left">
                <AboutSection language={language} />
              </Modal>
            )}

            {/* Diretores */}
            {activeModal === 'directors' && (
              <Modal isOpen onClose={handleCloseModal} direction="right">
                <DirectorsSection 
                  language={language} 
                  onVideoOpen={setIsVideoOpen} 
                  onDirectorSelect={setIsInDirectorPortfolio}
                />
              </Modal>
            )}

            {/* Cosmos/VFX */}
            {activeModal === 'cosmos' && (
              <Modal isOpen onClose={handleCloseModal} direction="left">
                <CosmosSection language={language} />
              </Modal>
            )}

            {/* Contato */}
            {activeModal === 'contact' && (
              <Modal isOpen onClose={handleCloseModal} direction="left">
                <ContactSection language={language} />
              </Modal>
            )}
          </Suspense>
        </motion.div>
      )}
    </div>
  );
}