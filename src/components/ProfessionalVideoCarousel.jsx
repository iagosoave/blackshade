// src/components/ProfessionalVideoCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfessionalVideoCarousel({ videos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef([]);
  const intervalRef = useRef(null);

  // SEGREDO 1: Carregar apenas 3 vídeos por vez (atual, anterior e próximo)
  const getVideosToLoad = () => {
    const prev = (currentIndex - 1 + videos.length) % videos.length;
    const next = (currentIndex + 1) % videos.length;
    return [prev, currentIndex, next];
  };

  // SEGREDO 2: Pré-carregar vídeos de forma inteligente
  useEffect(() => {
    const videosToLoad = getVideosToLoad();
    
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (videosToLoad.includes(index)) {
          // Carrega apenas os vídeos necessários
          video.preload = index === currentIndex ? 'auto' : 'metadata';
          
          if (index === currentIndex) {
            // Toca o vídeo atual
            video.currentTime = 0;
            video.play().catch(() => {
              // Fallback silencioso
              document.addEventListener('click', () => video.play(), { once: true });
            });
          } else {
            // Pausa os outros
            video.pause();
            video.currentTime = 0;
          }
        } else {
          // Remove source dos vídeos não utilizados para economizar memória
          video.preload = 'none';
          video.pause();
        }
      }
    });
  }, [currentIndex, videos.length]);

  // SEGREDO 3: Transição suave com fade (não slide)
  const handleVideoEnd = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Configurar evento de fim do vídeo
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;

    currentVideo.addEventListener('ended', handleVideoEnd);

    return () => {
      currentVideo.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentIndex]);

  // Auto-play com timer de 8 segundos se o vídeo for muito longo
  useEffect(() => {
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      const currentVideo = videoRefs.current[currentIndex];
      if (currentVideo && currentVideo.duration > 8) {
        handleVideoEnd();
      }
    }, 8000);

    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Container de Vídeos */}
      <div className="absolute inset-0">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex && !isTransitioning ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Filtro escuro como no Barry */}
            <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            
            {/* Vídeo */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="none"
              poster={video.poster || ''}
            >
              <source src={video.url} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>


    </div>
  );
}