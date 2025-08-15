import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useContentful from '../hocks/useContentful';

// Vídeos
import backgroundVideo1 from '../01.mp4';
import backgroundVideo2 from '../02.mp4';
import backgroundVideo3 from '../03.mp4';

export default function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  
  // Array de vídeos
  const videos = [backgroundVideo1, backgroundVideo2, backgroundVideo3];
  
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
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
              opacity: index === currentVideoIndex ? 1 : 0,
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
              zIndex: index === currentVideoIndex ? 2 : 1,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <source src={video} type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        ))}
      </div>
    </motion.div>
  );
}