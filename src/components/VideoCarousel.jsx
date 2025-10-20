import React, { useState, useEffect, useRef } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const videoCache = useRef({});
  
  const videos = [
    '/videos/01.webm',
    '/videos/02.webm',
    '/videos/03.webm',
    '/videos/04.webm',
    '/videos/05.webm',
    '/videos/06.webm',
    '/videos/07.webm',
    '/videos/08.webm',
    '/videos/09.webm',
    '/videos/10.webm',
    '/videos/11.webm',
    '/videos/12.webm'
  ];

  // Pré-carrega vídeos adjacentes
  const preloadVideo = (index) => {
    if (videoCache.current[index]) return;
    
    const video = document.createElement('video');
    video.src = videos[index];
    video.preload = 'auto';
    video.load();
    videoCache.current[index] = true;
  };

  useEffect(() => {
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    if (!video || !nextVideo) return;

    // Configura vídeo atual
    video.src = videos[currentVideoIndex];
    video.load();
    
    // Pré-carrega vídeos adjacentes (anterior, atual e próximo)
    const prevIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    
    preloadVideo(prevIndex);
    preloadVideo(currentVideoIndex);
    preloadVideo(nextIndex);
    
    // Configura próximo vídeo
    nextVideo.src = videos[nextIndex];
    nextVideo.load();
    
    // Toca o vídeo atual
    const playVideo = () => {
      video.play().catch(() => {
        // Se autoplay falhar, espera clique
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    };
    
    // Inicia quando estiver pronto
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }
    
  }, [currentVideoIndex]);

  const handleVideoEnded = () => {
    if (isTransitioning) return;
    
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    setIsTransitioning(true);
    
    // Troca rápida
    nextVideo.style.display = 'block';
    nextVideo.play();
    video.style.display = 'none';
    
    // Atualiza estado
    setCurrentVideoIndex(nextIndex);
    
    // Reseta displays após transição
    setTimeout(() => {
      video.style.display = 'block';
      nextVideo.style.display = 'none';
      setIsTransitioning(false);
    }, 100);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={handleVideoEnded}
      />
      
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: 'none' }}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}