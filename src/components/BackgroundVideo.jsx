// src/components/IconoclastVideoSystem.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function BackgroundVideo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRefs = useRef([]);
  const loadedVideos = useRef(new Set());
  
  // Seus 8 vídeos
  const videos = [
    { url: '/videos/01.mp4', poster: null },
    { url: '/videos/02.mp4', poster: null },
    { url: '/videos/03.mp4', poster: null },
    { url: '/videos/04.mp4', poster: null },
    { url: '/videos/05.mp4', poster: null },
    { url: '/videos/06.mp4', poster: null },
    { url: '/videos/07.mp4', poster: null },
    { url: '/videos/08.mp4', poster: null }
  ];

  // SOLUÇÃO 1: Detectar interação do usuário primeiro
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  // SOLUÇÃO 2: Pré-carregar o primeiro vídeo completamente antes de mostrar
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (!firstVideo) return;

    // Configura o primeiro vídeo
    firstVideo.src = videos[0].url;
    firstVideo.preload = 'auto';
    
    // Espera o vídeo estar REALMENTE pronto
    const handleCanPlayThrough = () => {
      loadedVideos.current.add(0);
      setIsReady(true);
      
      // Tenta tocar com delay para garantir
      setTimeout(() => {
        firstVideo.play().catch(() => {
          console.log('Aguardando interação do usuário...');
        });
      }, 100);
    };

    // Usa canplaythrough em vez de canplay para garantir buffer suficiente
    firstVideo.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

    return () => {
      firstVideo.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [videos]);

  // SOLUÇÃO 3: Gerenciamento inteligente de memória com delay
  useEffect(() => {
    if (!isReady) return;

    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    const nextIndex = (currentIndex + 1) % videos.length;
    const toLoad = [prevIndex, currentIndex, nextIndex];
    
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      
      if (toLoad.includes(index)) {
        // Carrega vídeos necessários com delay progressivo
        setTimeout(() => {
          if (!video.src || video.src === '') {
            video.src = videos[index].url;
            video.preload = index === currentIndex ? 'auto' : 'metadata';
            video.load();
            
            video.addEventListener('canplaythrough', () => {
              loadedVideos.current.add(index);
            }, { once: true });
          }
          
          if (index === currentIndex) {
            // Mostra e toca o vídeo atual
            video.style.opacity = '1';
            video.style.zIndex = '10';
            
            // Só toca se já carregou ou se usuário já interagiu
            if (loadedVideos.current.has(index) || hasInteracted) {
              video.currentTime = 0;
              video.play().catch(() => {
                // Se falhar, espera interação
                const playOnInteraction = () => {
                  video.play();
                  setHasInteracted(true);
                };
                document.addEventListener('click', playOnInteraction, { once: true });
              });
            }
          } else {
            // Esconde os adjacentes
            video.style.opacity = '0';
            video.style.zIndex = '0';
            video.pause();
          }
        }, index === currentIndex ? 0 : 500); // Delay para não congestionar
        
      } else {
        // Limpa vídeos distantes após um delay
        setTimeout(() => {
          if (video.src && video.src !== '') {
            video.pause();
            video.style.opacity = '0';
            video.style.zIndex = '0';
            video.removeAttribute('src');
            video.load();
            loadedVideos.current.delete(index);
          }
        }, 1000);
      }
    });
  }, [currentIndex, videos, isReady, hasInteracted]);
  
  // SOLUÇÃO 4: Transição mais suave entre vídeos
  useEffect(() => {
    if (!isReady) return;
    
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;
    
    const handleEnded = () => {
      // Pré-carrega o próximo antes de trocar
      const nextIndex = (currentIndex + 1) % videos.length;
      const nextVideo = videoRefs.current[nextIndex];
      
      if (nextVideo && loadedVideos.current.has(nextIndex)) {
        // Próximo já está pronto, troca suave
        currentVideo.style.transition = 'opacity 0.3s ease-out';
        currentVideo.style.opacity = '0';
        
        setTimeout(() => {
          setCurrentIndex(nextIndex);
        }, 300);
      } else {
        // Próximo ainda não está pronto, espera um pouco
        setTimeout(() => {
          setCurrentIndex(nextIndex);
        }, 500);
      }
    };
    
    currentVideo.addEventListener('ended', handleEnded);
    return () => {
      currentVideo.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, videos.length, isReady]);

  // SOLUÇÃO 5: Fallback para conexões lentas - toca após 3 segundos mesmo se não carregou tudo
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isReady) {
        console.log('Forçando início após 3 segundos...');
        setIsReady(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isReady]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Placeholder enquanto carrega (opcional - pode adicionar uma imagem) */}
      {!isReady && (
        <div className="absolute inset-0 bg-black z-30" />
      )}
      
      {/* 8 elementos de vídeo */}
      {videos.map((video, index) => (
        <video
          key={index}
          ref={(el) => (videoRefs.current[index] = el)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: index === 0 && isReady ? '1' : '0',
            zIndex: index === 0 ? '10' : '0',
            transition: 'opacity 0.5s ease-in-out',
            willChange: 'opacity'
          }}
          poster={video.poster}
          playsInline
          muted
          autoPlay={false}
          preload="none"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          webkit-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
        />
      ))}
    </div>
  );
}