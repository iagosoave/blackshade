// src/components/VideoCarousel.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const [transitioning, setTransitioning] = useState(false);

  const videos = [
    '/videos/01.webm',
    '/videos/02.mp4',
    '/videos/03.mp4',
    '/videos/04.mp4',
    '/videos/05.mp4',
    '/videos/06.mp4',
    '/videos/07.mp4',
    '/videos/08.mp4'
  ];

  const handleVideoEnded = () => {
    // Inicia a transição
    setTransitioning(true);

    // O próximo vídeo se torna o vídeo atual
    setTimeout(() => {
      setCurrentVideoIndex(nextVideoIndex);
      setNextVideoIndex((nextVideoIndex + 1) % videos.length);
      setTransitioning(false);
    }, 500); // Duração da transição em milissegundos
  };

  useEffect(() => {
    const currentVideo = currentVideoRef.current;
    const nextVideo = nextVideoRef.current;

    if (currentVideo) {
      currentVideo.src = videos[currentVideoIndex];
      currentVideo.load();
      currentVideo.oncanplay = () => {
        currentVideo.play().catch(() => {
          document.addEventListener('click', () => {
            currentVideo.play();
          }, { once: true });
        });
      };
    }

    if (nextVideo) {
      nextVideo.src = videos[nextVideoIndex];
      nextVideo.load();
    }
  }, [currentVideoIndex, nextVideoIndex, videos]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Vídeo atual, com transição de opacidade */}
      <video
        ref={currentVideoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        style={{ opacity: transitioning ? 0 : 1 }}
        muted
        autoPlay
        playsInline
        onEnded={handleVideoEnded}
      />
      {/* Próximo vídeo, pré-carregado e inicialmente transparente */}
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: transitioning ? 1 : 0 }}
        muted
        playsInline
      />
    </div>
  );
}