import React, { useState, useEffect, useRef } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);
  
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

  useEffect(() => {
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    if (!video || !nextVideo) return;

    // Configura vídeo atual
    video.src = videos[currentVideoIndex];
    video.load();
    
    // Configura próximo vídeo
    const nextIndex = (currentVideoIndex + 1) % videos.length;
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
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
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