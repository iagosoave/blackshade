import React, { useState, useEffect, useRef, useCallback } from 'react';

const VIDEOS = [
  '/videos/01.webm',
  '/videos/02.webm',
  '/videos/03.webm',
  '/videos/04.webm',
  '/videos/05.webm'
];

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const preloadedRef = useRef(new Set([0]));

  // Preload do próximo vídeo
  const preloadNext = useCallback((index) => {
    if (preloadedRef.current.has(index)) return;
    
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = VIDEOS[index];
    video.load();
    preloadedRef.current.add(index);
  }, []);

  // Efeito para precarregar vídeos adjacentes
  useEffect(() => {
    const next = (currentIndex + 1) % VIDEOS.length;
    const afterNext = (currentIndex + 2) % VIDEOS.length;
    
    setNextIndex(next);
    
    // Preload com pequeno delay para não competir com o vídeo atual
    const timer = setTimeout(() => {
      preloadNext(next);
      preloadNext(afterNext);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex, preloadNext]);

  // Inicia reprodução do vídeo atual
  useEffect(() => {
    const video = currentVideoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.currentTime = 0;
        await video.play();
      } catch (err) {
        // Autoplay bloqueado - adiciona listener para interação
        const handleInteraction = () => {
          video.play().catch(() => {});
        };
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
      }
    };

    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplaythrough', playVideo, { once: true });
    }
  }, [currentIndex]);

  // Prepara o próximo vídeo
  useEffect(() => {
    const nextVideo = nextVideoRef.current;
    if (!nextVideo) return;

    nextVideo.src = VIDEOS[nextIndex];
    nextVideo.load();
  }, [nextIndex]);

  // Handler quando vídeo termina
  const handleVideoEnded = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const nextVideo = nextVideoRef.current;
    const currentVideo = currentVideoRef.current;

    // Fade transition
    if (nextVideo && currentVideo) {
      nextVideo.style.opacity = '1';
      nextVideo.style.zIndex = '2';
      nextVideo.play().catch(() => {});
      
      currentVideo.style.opacity = '0';
      currentVideo.style.zIndex = '1';
    }

    // Atualiza índices após transição
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
      
      // Reseta estilos
      if (currentVideo) {
        currentVideo.style.opacity = '1';
        currentVideo.style.zIndex = '2';
      }
      if (nextVideo) {
        nextVideo.style.opacity = '0';
        nextVideo.style.zIndex = '1';
      }
    }, 300);
  }, [nextIndex, isTransitioning]);

  // Visibility change - pausa quando tab não está visível
  useEffect(() => {
    const handleVisibility = () => {
      const video = currentVideoRef.current;
      if (!video) return;
      
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Vídeo Atual */}
      <video
        ref={currentVideoRef}
        key={`current-${currentIndex}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: 1, zIndex: 2 }}
        src={VIDEOS[currentIndex]}
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
      />
      
      {/* Próximo Vídeo (pré-carregado) */}
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: 0, zIndex: 1 }}
        muted
        playsInline
        preload="auto"
      />

    </div>
  );
}