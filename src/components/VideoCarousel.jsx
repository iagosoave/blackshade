import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef({});
  
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

  // Manipula o fim do vídeo
  const handleVideoEnded = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, [videos.length]);

  // Garante autoplay e prepara próximo vídeo
  useEffect(() => {
    // Pega referências dos vídeos atual e próximo
    const currentVideo = videoRefs.current[currentVideoIndex];
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const nextVideo = videoRefs.current[nextIndex];

    // Função para iniciar o vídeo atual
    const playCurrentVideo = async () => {
      if (!currentVideo) return;
      
      try {
        // Remove o currentTime para evitar pulos
        currentVideo.currentTime = 0;
        await currentVideo.play();
      } catch (error) {
        console.log('Autoplay bloqueado, aguardando interação do usuário');
        
        // Aguarda clique do usuário
        const handleUserInteraction = async () => {
          try {
            if (currentVideo) await currentVideo.play();
            // Prepara o próximo vídeo também
            if (nextVideo) {
              await nextVideo.play();
              nextVideo.pause();
              nextVideo.currentTime = 0;
            }
          } catch (e) {
            console.error('Erro ao iniciar vídeo:', e);
          }
        };
        
        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('touchstart', handleUserInteraction, { once: true });
      }
    };

    // Função para preparar o próximo vídeo
    const prepareNextVideo = async () => {
      if (!nextVideo) return;
      
      try {
        nextVideo.load();
        // Pequeno delay antes de tentar o play/pause para buffering
        setTimeout(async () => {
          if (nextVideo.readyState >= 3) {
            try {
              await nextVideo.play();
              nextVideo.pause();
              nextVideo.currentTime = 0;
            } catch (e) {
              // Silently fail - não é crítico
            }
          }
        }, 500);
      } catch (e) {
        console.log('Erro ao preparar próximo vídeo:', e);
      }
    };

    // Inicia o vídeo atual
    if (currentVideo) {
      if (currentVideo.readyState >= 3) {
        playCurrentVideo();
      } else {
        const handleCanPlay = () => playCurrentVideo();
        currentVideo.addEventListener('canplay', handleCanPlay, { once: true });
        
        // Cleanup
        return () => {
          if (currentVideo) {
            currentVideo.removeEventListener('canplay', handleCanPlay);
          }
        };
      }
    }

    // Prepara o próximo vídeo com um pequeno delay
    const prepareTimeout = setTimeout(prepareNextVideo, 100);

    return () => {
      clearTimeout(prepareTimeout);
    };
  }, [currentVideoIndex, videos.length]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {videos.map((src, index) => {
        const isActive = index === currentVideoIndex;
        const isNext = index === (currentVideoIndex + 1) % videos.length;
        const isPrevious = index === (currentVideoIndex - 1 + videos.length) % videos.length;
        
        return (
          <video
            key={`video-${index}-${src}`}
            ref={el => {
              if (el) videoRefs.current[index] = el;
            }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              display: isActive ? 'block' : 'none',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            src={src}
            muted
            playsInline
            autoPlay={false} // Controlamos manualmente
            preload={isActive || isNext ? 'auto' : isPrevious ? 'metadata' : 'none'}
            onEnded={isActive ? handleVideoEnded : undefined}
            onError={(e) => {
              console.error(`Erro no vídeo ${index}:`, e);
              if (isActive) {
                // Pula para o próximo em caso de erro
                handleVideoEnded();
              }
            }}
          />
        );
      })}
      
      {/* Debug info - remover em produção */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 text-white text-xs z-20 bg-black/50 p-2 rounded">
          Vídeo: {currentVideoIndex + 1}/{videos.length}
        </div>
      )}
    </div>
  );
}