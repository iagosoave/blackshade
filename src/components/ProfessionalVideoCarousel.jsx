// src/components/ProfessionalVideoCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfessionalVideoCarousel({ videos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef([]);
  const progressRef = useRef(null);
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

  // SEGREDO 4: Progress bar animada
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;

    const updateProgress = () => {
      if (progressRef.current && currentVideo.duration) {
        const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
        progressRef.current.style.width = `${progress}%`;
      }
    };

    currentVideo.addEventListener('timeupdate', updateProgress);
    currentVideo.addEventListener('ended', handleVideoEnd);

    return () => {
      currentVideo.removeEventListener('timeupdate', updateProgress);
      currentVideo.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentIndex]);

  // SEGREDO 5: Auto-play com timer de 8 segundos se o vídeo for muito longo
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

  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

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

      {/* Dots de Navegação (estilo Barry Company) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`relative w-12 h-1 bg-white/30 overflow-hidden transition-all ${
              index === currentIndex ? 'bg-white/60' : ''
            }`}
          >
            {index === currentIndex && (
              <div
                ref={index === currentIndex ? progressRef : null}
                className="absolute inset-0 h-full bg-white transition-all"
                style={{ width: '0%' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Opcional: Título do vídeo */}
      <AnimatePresence mode="wait">
        {videos[currentIndex].title && (
          <motion.div
            key={currentIndex}
            className="absolute bottom-24 left-12 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-white text-4xl font-bold">
              {videos[currentIndex].title}
            </h2>
            {videos[currentIndex].subtitle && (
              <p className="text-white/80 text-lg mt-2">
                {videos[currentIndex].subtitle}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}