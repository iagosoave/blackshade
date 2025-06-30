import React, { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes
import Logo from './components/Logo';
import Menu from './components/Menu';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';

// Ganchos customizados (mantido, caso seja usado para outros dados)
// Se 'useContentful' não for mais usado em nenhum lugar do App, você pode removê-lo completamente.
// Por enquanto, vamos deixá-lo caso você o use para outros dados que não o vídeo.
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
  const [activeModal, setActiveModal] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isVideoOpen, setIsVideoOpen] = useState(false); // Mantido para controle de modais de vídeo internos (se houver)
  const [showIntro, setShowIntro] = useState(true);
  
  // 'homepageData' mantido apenas se for usado para outras informações
  // Se não for mais usado para NADA, você pode remover esta linha e o import de 'useContentful'.
  const { data: homepageData } = useContentful('homepage'); 
  
  const videoRef = useRef(null);

  // Efeito para garantir o autoplay e tratamento de erros no vídeo de fundo
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.muted = true; // Garante que esteja mutado para autoplay
      videoElement.playsInline = true; // Garante playsInline

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
        // Limpa o event listener se o componente for desmontado
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
    setIsVideoOpen(false); // Reseta o estado de vídeo aberto ao clicar no logo
  }, []);

  // Define a fonte do vídeo de fundo diretamente para o arquivo importado
  const videoSource = backgroundVideo; 

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Vídeo de Background - MP4 direto */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay // Tenta iniciar automaticamente
          loop     // Repete o vídeo
          muted    // ESSENCIAL para autoplay em navegadores móveis (iOS, Android)
          playsInline // ESSENCIAL para reprodução in-line no iOS, não em fullscreen
          webkit-playsinline="true" // Compatibilidade para Webkit (iOS Safari)
          x5-playsinline="true"     // Compatibilidade para alguns navegadores chineses
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSource} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>

      {/* Animação de Introdução */}
      <AnimatePresence>
        {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* Conteúdo Principal da Aplicação (após a introdução) */}
      {!showIntro && (
        <motion.div
          className="relative z-10 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Logo onClick={handleLogoClick} />
          {/* O LanguageSwitcher e o Menu só aparecem se nenhum modal estiver ativo e nenhum vídeo interno estiver aberto */}
          {!activeModal && !isVideoOpen && <LanguageSwitcher language={language} onChange={setLanguage} />}
          {!isVideoOpen && <Menu onItemClick={handleMenuClick} language={language} />}

          {/* Modais de Seções com carregamento lazy */}
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