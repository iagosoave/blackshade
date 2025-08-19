// src/components/BackgroundVideo.jsx
import React, { useEffect, useRef } from 'react';
import { useVideoPreloader } from '../hooks/useVideoPreloader';

export default function BackgroundVideo({ videos, opacity = 1, loop = true }) {
  const { currentVideo, goToNext } = useVideoPreloader(videos);
  const videoRef = useRef(null);

  // Ação quando o vídeo termina
  const handleVideoEnd = () => {
    // Se a lista tiver mais de um vídeo, vá para o próximo
    if (videos.length > 1) {
      goToNext();
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      // Atualiza o src do vídeo com o vídeo atual do preloader
      videoRef.current.src = currentVideo;
      
      // Define a propriedade loop com base na quantidade de vídeos
      videoRef.current.loop = loop && videos.length === 1;

      // Tenta dar play no vídeo
      videoRef.current.play().catch(error => {
        console.error("Autoplay foi impedido:", error);
      });
    }
  }, [currentVideo, videos.length, loop]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity,
          pointerEvents: 'none'
        }}
        muted
        playsInline
        autoPlay
        onEnded={handleVideoEnd}
      />
    </div>
  );
}