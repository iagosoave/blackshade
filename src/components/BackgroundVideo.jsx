import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function BackgroundVideo({ videos, opacity = 1, loop = false }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const handleVideoEnd = useCallback(() => {
    if (loop) {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }
  }, [videos.length, loop]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = true;
    videoElement.playsInline = true;
    
    // Configura o loop apenas para um único vídeo, se houver.
    if (videos.length === 1 && loop) {
      videoElement.loop = true;
    } else {
      videoElement.loop = false;
      videoElement.addEventListener('ended', handleVideoEnd);
    }

    const playVideo = () => {
      videoElement.play().catch(err => {
        console.warn('Erro ao tentar reproduzir o vídeo automaticamente:', err);
      });
    };

    if (videoElement.readyState >= 3) {
      playVideo();
    } else {
      videoElement.addEventListener('loadeddata', playVideo);
    }

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
      videoElement.removeEventListener('loadeddata', playVideo);
    };
  }, [currentVideoIndex, videos.length, handleVideoEnd, loop]);

  return (
    <video
      key={`video-${currentVideoIndex}`}
      ref={videoRef}
      autoPlay
      muted
      playsInline
      controls={false}
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      style={{ opacity, pointerEvents: 'none' }}
    >
      <source src={videos[currentVideoIndex]} type="video/mp4" />
      Seu navegador não suporta a tag de vídeo.
    </video>
  );
}