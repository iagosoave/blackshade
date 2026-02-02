import React, { useState, useEffect, useRef, useCallback } from 'react';

// Detecta se é iOS/Safari (não suporta WebM)
const isIOSorSafari = () => {
  if (typeof window === 'undefined') return false;
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  return isIOS || isSafari;
};

// WebM para todos, MP4 apenas para iOS/Safari
const getVideoSources = () => {
  if (isIOSorSafari()) {
    return [
      '/videos/01.mp4',
      '/videos/02.mp4',
      '/videos/03.mp4',
      '/videos/04.mp4',
      '/videos/05.mp4'
    ];
  }
  return [
    '/videos/01.webm',
    '/videos/02.webm',
    '/videos/03.webm',
    '/videos/04.webm',
    '/videos/05.webm'
  ];
};

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videos] = useState(getVideoSources);
  
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const preloadedRef = useRef(new Set([0]));
  const isIOS = useRef(isIOSorSafari());

  // Preload do próximo vídeo (menos agressivo em iOS)
  const preloadNext = useCallback((index) => {
    if (preloadedRef.current.has(index)) return;
    
    // Em iOS, limita preload para economizar recursos
    if (isIOS.current && preloadedRef.current.size > 1) return;
    
    const video = document.createElement('video');
    video.preload = isIOS.current ? 'metadata' : 'auto';
    video.src = videos[index];
    video.load();
    preloadedRef.current.add(index);
  }, [videos]);

  // Prepara próximos vídeos
  useEffect(() => {
    const next = (currentIndex + 1) % videos.length;
    const afterNext = (currentIndex + 2) % videos.length;
    
    setNextIndex(next);
    
    // Delay maior para iOS
    const delay = isIOS.current ? 1500 : 500;
    
    const timer = setTimeout(() => {
      preloadNext(next);
      if (!isIOS.current) {
        preloadNext(afterNext);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, preloadNext, videos.length]);

  // Inicia reprodução
  useEffect(() => {
    const video = currentVideoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.currentTime = 0;
        
        // Delay para iOS processar
        if (isIOS.current) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        await video.play();
        setIsLoaded(true);
      } catch (err) {
        // Autoplay bloqueado - espera interação
        const handleInteraction = () => {
          video.play().catch(() => {});
          setIsLoaded(true);
        };
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
      }
    };

    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplaythrough', playVideo, { once: true });
      
      // Timeout de segurança
      const timeout = setTimeout(() => {
        if (!isLoaded) playVideo();
      }, 4000);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, isLoaded]);

  // Prepara o próximo vídeo
  useEffect(() => {
    const nextVideo = nextVideoRef.current;
    if (!nextVideo) return;

    nextVideo.src = videos[nextIndex];
    nextVideo.load();
  }, [nextIndex, videos]);

  // Handler quando vídeo termina
  const handleVideoEnded = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const nextVideo = nextVideoRef.current;
    const currentVideo = currentVideoRef.current;

    if (nextVideo && currentVideo) {
      nextVideo.style.opacity = '1';
      nextVideo.style.zIndex = '2';
      nextVideo.play().catch(() => {});
      
      currentVideo.style.opacity = '0';
      currentVideo.style.zIndex = '1';
    }

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
      
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

  // Pausa quando tab não visível
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
      {/* Loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Vídeo Atual */}
      <video
        ref={currentVideoRef}
        key={`current-${currentIndex}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: 1, zIndex: 2 }}
        src={videos[currentIndex]}
        muted
        loop={false}
        playsInline
        webkit-playsinline="true"
        preload={isIOS.current ? "metadata" : "auto"}
        onEnded={handleVideoEnded}
        onLoadedData={() => setIsLoaded(true)}
      />
      
      {/* Próximo Vídeo */}
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: 0, zIndex: 1 }}
        muted
        playsInline
        webkit-playsinline="true"
        preload="metadata"
      />
    </div>
  );
}