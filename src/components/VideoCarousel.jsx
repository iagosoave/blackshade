// src/components/VideoCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);
  
  const videos = [
    '/videos/01.mp4',
    '/videos/02.mp4',
    '/videos/03.mp4',
    '/videos/04.mp4',
    '/videos/05.mp4',
    '/videos/06.mp4',
    '/videos/07.mp4',
    '/videos/08.mp4'
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Quando terminar, vai pro próximo
    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [videos.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Troca o vídeo
    video.src = videos[currentIndex];
    video.load();
    
    // Tenta tocar depois de carregar
    video.oncanplay = () => {
      video.play().catch(() => {
        // Se não conseguir, espera clique
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    };
  }, [currentIndex, videos]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}