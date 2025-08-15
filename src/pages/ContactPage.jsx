import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContactSection from '../sections/ContactSection';

// Vídeos de background
import backgroundVideo2 from '../03.mp4';

export default function ContactPage({ language }) {
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  
  // Array de vídeos
  const videos = [ backgroundVideo2];

  const handleClose = () => {
    navigate('/');
  };

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
      videoElement.loop = false;

      const playVideo = () => {
        videoElement.play().catch(err => {
          console.warn('Erro ao tentar reproduzir o vídeo automaticamente:', err);
          document.addEventListener('click', () => {
            videoElement.play().catch(e => console.error('Erro ao reproduzir vídeo após clique:', e));
          }, { once: true });
        });
      };

      const handleVideoEnd = () => {
        goToNextVideo();
      };

      videoElement.addEventListener('ended', handleVideoEnd);

      if (videoElement.readyState >= 3) {
        playVideo();
      } else {
        videoElement.addEventListener('loadeddata', playVideo);
      }

      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.removeEventListener('loadeddata', playVideo);
      };
    }
  }, [currentVideoIndex, goToNextVideo]);

  return (
    <>
      {/* Vídeos de Background com opacidade reduzida */}
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
              opacity: index === currentVideoIndex ? 0.2 : 0,
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
              zIndex: index === currentVideoIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <source src={video} type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        ))}
      </div>

      {/* Modal com o conteúdo de contato */}
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.4
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        
        <motion.div
          className="relative w-full h-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.button
            className="absolute top-6 right-6 text-white z-50 p-2"
            onClick={handleClose}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </motion.button>
          
          <div className="w-full h-full overflow-y-auto">
            <ContactSection language={language} />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}