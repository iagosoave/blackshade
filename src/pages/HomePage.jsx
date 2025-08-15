import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useContentful from '../hooks/useContentful';

// Vídeos
import backgroundVideo1 from '../01.mp4';
import backgroundVideo2 from '../02.mp4';
import backgroundVideo3 from '../03.mp4';
import backgroundVideo4 from '../04.mp4';
import backgroundVideo5 from '../05.mp4';
import backgroundVideo6 from '../06.mp4';
import backgroundVideo7 from '../07.mp4';
import backgroundVideo8 from '../08.mp4';

export default function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);
   
  // Array de vídeos
  const videos = [
    backgroundVideo1, 
    backgroundVideo2, 
    backgroundVideo3, 
    backgroundVideo4,
    backgroundVideo5,
    backgroundVideo6,
    backgroundVideo7,
    backgroundVideo8
  ];
   
  // Dados do Contentful (se necessário)
  const { data: homepageData } = useContentful('homepage');

  // Função otimizada para trocar vídeos
  const handleVideoEnd = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  // Efeito para configurar e trocar vídeos
  useEffect(() => {
    const currentVideo = videoRef.current;
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    
    if (currentVideo) {
      // Configurações básicas
      currentVideo.muted = true;
      currentVideo.playsInline = true;
      currentVideo.loop = false;
      
      // Play com fallback para click
      const playVideo = () => {
        currentVideo.play().catch(err => {
          console.warn('Autoplay bloqueado, aguardando interação:', err);
          const handleFirstClick = () => {
            currentVideo.play().catch(e => console.error('Erro ao reproduzir:', e));
            document.removeEventListener('click', handleFirstClick);
          };
          document.addEventListener('click', handleFirstClick, { once: true });
        });
      };

      // Adiciona listener para o fim do vídeo
      currentVideo.addEventListener('ended', handleVideoEnd);

      // Inicia o vídeo
      if (currentVideo.readyState >= 3) {
        playVideo();
      } else {
        currentVideo.addEventListener('loadeddata', playVideo, { once: true });
      }

      // Pré-carrega o próximo vídeo
      if (nextVideoRef.current) {
        nextVideoRef.current.src = videos[nextIndex];
        nextVideoRef.current.load();
      }

      return () => {
        currentVideo.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [currentVideoIndex, videos, handleVideoEnd]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
      {/* Vídeo Principal */}
      <video
        ref={videoRef}
        key={currentVideoIndex}
        autoPlay
        muted
        playsInline
        controls={false}
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          transform: 'scale(1.1)',
        }}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Seu navegador não suporta a tag de vídeo.
      </video>

      {/* Vídeo de pré-carregamento (invisível) */}
      <video
        ref={nextVideoRef}
        muted
        playsInline
        preload="auto"
        className="hidden"
        aria-hidden="true"
      />
    </motion.div>
  );
}