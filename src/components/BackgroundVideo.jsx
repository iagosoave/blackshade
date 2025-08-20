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

  // Detectar interação do usuário
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

  // Pré-carregar o primeiro vídeo
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (!firstVideo) return;

    firstVideo.src = videos[0].url;
    firstVideo.preload = 'auto';
    
    const handleCanPlayThrough = () => {
      loadedVideos.current.add(0);
      setIsReady(true);
      
      setTimeout(() => {
        firstVideo.play().catch(() => {
          console.log('Aguardando interação do usuário...');
        });
      }, 100);
    };

    firstVideo.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

    return () => {
      firstVideo.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [videos]);

  // Gerenciamento de vídeos com técnica Iconoclast
  useEffect(() => {
    if (!isReady) return;

    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    const nextIndex = (currentIndex + 1) % videos.length;
    const toLoad = [prevIndex, currentIndex, nextIndex];
    
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      
      if (toLoad.includes(index)) {
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
            // Configurações críticas para velocidade
            video.style.opacity = '1';
            video.style.zIndex = '10';
            video.style.transition = 'opacity 1ms linear'; // INSTANTÂNEO!
            
            if (loadedVideos.current.has(index) || hasInteracted) {
              video.currentTime = 0;
              video.play().catch(() => {
                const playOnInteraction = () => {
                  video.play();
                  setHasInteracted(true);
                };
                document.addEventListener('click', playOnInteraction, { once: true });
              });
            }
          } else {
            video.style.opacity = '0';
            video.style.zIndex = '0';
            video.style.transition = 'opacity 1ms linear';
            video.pause();
          }
        }, index === currentIndex ? 0 : 500);
        
      } else {
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
  
  // Transição entre vídeos
  useEffect(() => {
    if (!isReady) return;
    
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;
    
    const handleEnded = () => {
      // Transição INSTANTÂNEA
      currentVideo.style.transition = 'opacity 1ms linear';
      currentVideo.style.opacity = '0';
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }, 10); // Apenas 10ms de delay
    };
    
    currentVideo.addEventListener('ended', handleEnded);
    return () => {
      currentVideo.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, videos.length, isReady]);

  // Fallback para conexões lentas
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
      {/* Tela preta enquanto carrega (sem spinner) */}
      {!isReady && (
        <div className="absolute inset-0 bg-black z-30" />
      )}
      
      {/* 8 elementos de vídeo com configurações otimizadas */}
      {videos.map((video, index) => (
        <video
          key={index}
          ref={(el) => (videoRefs.current[index] = el)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: index === 0 && isReady ? '1' : '0',
            zIndex: index === 0 ? '10' : '0',
            transition: 'opacity 1ms linear', // CRÍTICO: 1ms em vez de 500ms!
            willChange: 'opacity'
          }}
          poster={video.poster}
          playsInline
          muted // CRÍTICO: sem isso não funciona autoplay!
          autoPlay // IMPORTANTE: ativar autoplay
          preload="none"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        />
      ))}
    </div>
  );
}