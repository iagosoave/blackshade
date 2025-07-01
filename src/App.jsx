import React, { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes
import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';

// Ganchos customizados (mantido, caso seja usado para outros dados)
import useContentful from './hocks/useContentful'; 

// Imagens e Vídeo
import logo from './logo.png';
import backgroundVideo from './video.mp4'; // Importa diretamente o seu vídeo local

// Traduções
import { translations } from './config/translations';

// Carregamento lazy das seções
const DirectorsSection = lazy(() => import('./sections/DirectorsSection'));
const MusicSection = lazy(() => import('./sections/MusicSection'));
const AISection = lazy(() => import('./sections/AISection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));

// O componente IntroAnimation não será mais renderizado,
// mas vamos mantê-lo comentado caso você queira reativá-lo facilmente no futuro.
/*
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
*/

// Componente Principal da Aplicação
export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false); 
  // Alterado para 'false' para desativar a animação de introdução
  const [showIntro, setShowIntro] = useState(false); 
  
  const { data: homepageData } = useContentful('homepage'); 
  
  const videoRef = useRef(null);

  // Efeito para garantir o autoplay e tratamento de erros no vídeo de fundo
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.muted = true; 
      videoElement.playsInline = true; 

      const playVideo = () => {
        videoElement.play().catch(err => {
          console.warn('Erro ao tentar reproduzir o vídeo automaticamente:', err);
          // Fallback: Tenta reproduzir com interação do usuário se o autoplay for bloqueado
          document.addEventListener('click', () => {
            videoElement.play().catch(e => console.error('Erro ao reproduzir vídeo após clique:', e));
          }, { once: true });
        });
      };
      
      // Tenta tocar quando o vídeo estiver pronto
      if (videoElement.readyState >= 3) {
        playVideo();
      } else {
        videoElement.addEventListener('loadeddata', playVideo);
        return () => videoElement.removeEventListener('loadeddata', playVideo);
      }
    }
  }, []); // Dependência vazia, pois o vídeo de fundo é fixo e não depende de dados externos.

  // Funções de callback para o menu e logo
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

  // Define a fonte do vídeo de fundo diretamente para o arquivo importado
  const videoSource = backgroundVideo; 

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Vídeo de Background - MP4 direto */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          controls={false}
          preload="auto" // Mantenha ou tente 'metadata' se necessário
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: 'none' }}
        >
          <source src={videoSource} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>

      {/* A AnimatePresence e o IntroAnimation não serão renderizados devido a showIntro = false */}
      {/* <AnimatePresence>
        {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence> */}

      {/* Conteúdo Principal da Aplicação (sempre visível agora) */}
      {/* A condição !showIntro não é mais necessária aqui, mas pode ser mantida ou removida */}
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
    </div>
  );
}