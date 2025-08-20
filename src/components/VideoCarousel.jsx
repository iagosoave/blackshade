import React, { useState, useEffect, useRef } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const containerRef = useRef(null);
  
  const videos = [
    '/videos/01.webm',
    '/videos/02.webm',
    '/videos/03.webm',
    '/videos/04.webm',
    '/videos/05.webm',
    '/videos/06.webm',
    '/videos/07.webm',
    '/videos/08.webm'
  ];

  // Pré-carrega todos os vídeos na memória
  useEffect(() => {
    videos.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'video';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    const currentVideo = currentVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!currentVideo || !nextVideo) return;

    // Carrega o vídeo atual
    currentVideo.src = videos[currentVideoIndex];
    currentVideo.load();
    
    // Pré-carrega o próximo vídeo
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    nextVideo.src = videos[nextIndex];
    nextVideo.load();
    
    // Toca o vídeo atual assim que possível
    const playCurrentVideo = () => {
      currentVideo.play().catch(() => {
        // Se autoplay for bloqueado, espera clique do usuário
        const handleClick = () => {
          currentVideo.play();
          nextVideo.play().then(() => nextVideo.pause());
        };
        document.addEventListener('click', handleClick, { once: true });
      });
    };

    // Usa o evento com mais chance de sucesso para começar rapidamente
    if (currentVideo.readyState >= 3) {
      playCurrentVideo();
    } else {
      currentVideo.addEventListener('canplay', playCurrentVideo, { once: true });
    }

    // Pré-carrega e pausa o próximo vídeo
    const preloadNext = () => {
      nextVideo.play().then(() => {
        nextVideo.pause();
        nextVideo.currentTime = 0;
      }).catch(() => {});
    };
    
    nextVideo.addEventListener('canplay', preloadNext, { once: true });
  }, [currentVideoIndex, videos]);

  const handleVideoEnded = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    
    // Troca os vídeos instantaneamente
    currentVideoRef.current.style.display = 'none';
    nextVideoRef.current.style.display = 'block';
    nextVideoRef.current.play();
    
    // Atualiza o índice após um pequeno delay para preparar o próximo
    setTimeout(() => {
      setCurrentVideoIndex(nextIndex);
      // Reseta a visibilidade para o próximo ciclo
      currentVideoRef.current.style.display = 'block';
      nextVideoRef.current.style.display = 'none';
    }, 50);
  };

  // Pré-carrega próximos vídeos quando o atual estiver na metade
  useEffect(() => {
    const video = currentVideoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > video.duration * 0.5) {
        // Garante que os próximos 2 vídeos estejam carregados
        const next1 = (currentVideoIndex + 1) % videos.length;
        const next2 = (currentVideoIndex + 2) % videos.length;
        
        // Cria elementos invisíveis para pré-carregar
        [next1, next2].forEach(idx => {
          const preloadVideo = document.createElement('video');
          preloadVideo.src = videos[idx];
          preloadVideo.load();
        });
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [currentVideoIndex, videos]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Vídeo atual */}
      <video
        ref={currentVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={handleVideoEnded}
        style={{ display: 'block' }}
      />
      
      {/* Próximo vídeo (pré-carregado e escondido) */}
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        style={{ display: 'none' }}
      />
      
      {/* Fallback com loading indicator sutil */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" 
             style={{ display: 'none' }} 
             id="loader" />
      </div>
    </div>
  );
}