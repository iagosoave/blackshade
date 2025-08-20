// src/components/IconoclastVideoSystem.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function  BackgroundVideo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const videoRefs = useRef([]);
  
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
  
  // TÉCNICA ICONOCLAST: Carrega apenas 3 vídeos por vez
  useEffect(() => {
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    const nextIndex = (currentIndex + 1) % videos.length;
    const toLoad = [prevIndex, currentIndex, nextIndex];
    
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      
      if (toLoad.includes(index)) {
        // CARREGA apenas os 3 vídeos necessários
        if (!video.src || video.src === '') {
          video.src = videos[index].url;
          video.load();
        }
        
        if (index === currentIndex) {
          // TOCA apenas o vídeo atual
          video.style.opacity = '1';
          video.style.zIndex = '10';
          
          // Reseta e toca
          video.currentTime = 0;
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Fallback silencioso para primeiro clique
              if (isFirstLoad) {
                const handleFirstClick = () => {
                  video.play();
                  document.removeEventListener('click', handleFirstClick);
                  document.removeEventListener('touchstart', handleFirstClick);
                };
                document.addEventListener('click', handleFirstClick, { once: true });
                document.addEventListener('touchstart', handleFirstClick, { once: true });
                setIsFirstLoad(false);
              }
            });
          }
        } else {
          // ESCONDE e PAUSA os adjacentes
          video.style.opacity = '0';
          video.style.zIndex = '0';
          video.pause();
        }
      } else {
        // LIMPA MEMÓRIA dos vídeos distantes
        if (video.src && video.src !== '') {
          video.pause();
          video.style.opacity = '0';
          video.style.zIndex = '0';
          // Remove source para liberar memória
          video.removeAttribute('src');
          video.load();
        }
      }
    });
  }, [currentIndex, videos, isFirstLoad]);
  
  // Avança automaticamente quando o vídeo termina
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;
    
    const handleEnded = () => {
      // Fade out suave antes de trocar
      currentVideo.style.transition = 'opacity 0.3s ease-out';
      currentVideo.style.opacity = '0';
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }, 300);
    };
    
    currentVideo.addEventListener('ended', handleEnded);
    return () => {
      currentVideo.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, videos.length]);

  // Pré-carrega o primeiro vídeo imediatamente
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo && !firstVideo.src) {
      firstVideo.src = videos[0].url;
      firstVideo.load();
    }
  }, [videos]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* 8 elementos de vídeo, mas só 3 carregados por vez */}
      {videos.map((video, index) => (
        <video
          key={index}
          ref={(el) => (videoRefs.current[index] = el)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: index === 0 ? '1' : '0',
            zIndex: index === 0 ? '10' : '0',
            transition: 'opacity 0.5s ease-in-out',
            willChange: 'opacity'
          }}
          poster={video.poster}
          playsInline
          muted
          autoPlay={false}
          preload="none"
          // Otimizações de performance
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