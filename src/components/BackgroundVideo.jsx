// src/components/BackgroundVideo.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function BackgroundVideo({ videos, opacity = 1 }) {
  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !videos || videos.length === 0) return;

    const video = videoRef.current;
    
    // Configurar o vídeo
    video.src = videos[currentIndex];
    
    // Evento quando o vídeo está pronto
    const handleCanPlay = () => {
      setIsLoading(false);
      video.play().catch(error => {
        console.error("Autoplay bloqueado:", error);
      });
    };

    // Evento quando o vídeo termina
    const handleEnded = () => {
      if (videos.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, videos]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ 
          opacity: isLoading ? 0 : opacity,
          pointerEvents: 'none'
        }}
        muted
        playsInline
        loop={videos.length === 1}
        preload="auto"
      />
    </div>
  );
}