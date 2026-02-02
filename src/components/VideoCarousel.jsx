import React, { useState, useEffect, useRef, useCallback } from 'react';

const VIDEOS = [
  '/videos/01.webm',
  '/videos/02.webm',
  '/videos/03.webm',
  '/videos/04.webm',
  '/videos/05.webm'
];

// Detecta iOS/Safari
const isIOSorSafari = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isIOS || isSafari;
};

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const isIOS = useRef(isIOSorSafari());
  const loadTimeoutRef = useRef(null);

  // Timeout - se não carregar em 5s no iOS, mostra fallback
  useEffect(() => {
    if (isIOS.current && !isLoaded) {
      loadTimeoutRef.current = setTimeout(() => {
        setShowFallback(true);
        const video = currentVideoRef.current;
        if (video) video.load();
      }, 5000);
    }
    
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [isLoaded]);

  // Inicia reprodução
  useEffect(() => {
    const video = currentVideoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.currentTime = 0;
        await video.play();
        setIsLoaded(true);
        setShowFallback(false);
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      } catch (err) {
        const handleInteraction = () => {
          video.play().then(() => {
            setIsLoaded(true);
            setShowFallback(false);
          }).catch(() => {});
        };
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
      }
    };

    const eventName = isIOS.current ? 'loadeddata' : 'canplaythrough';
    
    if (video.readyState >= (isIOS.current ? 2 : 3)) {
      playVideo();
    } else {
      video.addEventListener(eventName, playVideo, { once: true });
    }

    return () => video.removeEventListener(eventName, playVideo);
  }, [currentIndex]);

  // Handler quando vídeo termina
  const handleVideoEnded = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const nextIdx = (currentIndex + 1) % VIDEOS.length;
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
      setCurrentIndex(nextIdx);
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
  }, [currentIndex, isTransitioning]);

  // Prepara próximo vídeo
  useEffect(() => {
    const nextVideo = nextVideoRef.current;
    if (!nextVideo) return;
    
    const nextIdx = (currentIndex + 1) % VIDEOS.length;
    nextVideo.src = VIDEOS[nextIdx];
    
    if (!isIOS.current) nextVideo.load();
  }, [currentIndex]);

  // Visibility change
  useEffect(() => {
    const handleVisibility = () => {
      const video = currentVideoRef.current;
      if (!video) return;
      
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const nextIdx = (currentIndex + 1) % VIDEOS.length;

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      
      {/* Fallback: Imagem enquanto carrega (iOS) */}
      {showFallback && (
        <div 
          className="absolute inset-0 z-[5] bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/imagens/background.webp)',
            filter: 'brightness(0.7)'
          }}
        />
      )}
      
      {/* Loading spinner */}
      {!isLoaded && !showFallback && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Vídeo Atual */}
      <video
        ref={currentVideoRef}
        key={`current-${currentIndex}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: isLoaded ? 1 : 0, zIndex: 2 }}
        src={VIDEOS[currentIndex]}
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        poster="/imagens/background.webp"
        onEnded={handleVideoEnded}
        onCanPlay={() => {
          if (isIOS.current) {
            const video = currentVideoRef.current;
            if (video) {
              video.play().then(() => {
                setIsLoaded(true);
                setShowFallback(false);
              }).catch(() => {});
            }
          }
        }}
        onLoadedData={() => {
          if (!isIOS.current) setIsLoaded(true);
        }}
      />
      
      {/* Próximo Vídeo */}
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: 0, zIndex: 1 }}
        muted
        playsInline
        webkit-playsinline="true"
        preload="none"
        poster="/imagens/background.webp"
      />

      {/* Botão play manual para iOS se autoplay falhar */}
      {showFallback && (
        <button
          className="absolute inset-0 z-20 flex items-center justify-center"
          onClick={() => {
            const video = currentVideoRef.current;
            if (video) {
              video.play().then(() => {
                setIsLoaded(true);
                setShowFallback(false);
              }).catch(() => {});
            }
          }}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}