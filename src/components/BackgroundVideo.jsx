// src/components/BackgroundVideo.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function BackgroundVideo({ videos, opacity = 1, loop = false }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const nextVideoUrl = useRef(null);

  // Pré-carregar próximo vídeo
  useEffect(() => {
    if (videos.length <= 1) return;
    
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    nextVideoUrl.current = videos[nextIndex];
    
    // Pré-carregar via link element
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'video';
    link.href = nextVideoUrl.current;
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [currentVideoIndex, videos]);

  const handleVideoEnd = useCallback(() => {
    if (!loop && currentVideoIndex === videos.length - 1) return;
    
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, [videos.length, loop, currentVideoIndex]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Configurações essenciais
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.setAttribute('webkit-playsinline', 'true');
    videoElement.preload = 'auto';
    
    // Loop para vídeo único
    if (videos.length === 1 && loop) {
      videoElement.loop = true;
    } else {
      videoElement.loop = false;
    }

    // Função para tocar o vídeo
    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (err) {
        console.log('Autoplay bloqueado, aguardando interação');
        
        const handleFirstInteraction = () => {
          videoElement.play();
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
        
        document.addEventListener('click', handleFirstInteraction, { once: true });
        document.addEventListener('touchstart', handleFirstInteraction, { once: true });
      }
    };

    // Atualizar source e tocar
    videoElement.src = videos[currentVideoIndex];
    
    const handleCanPlay = () => {
      playVideo();
    };

    const handleEnded = () => {
      handleVideoEnd();
    };

    // Adicionar listeners
    videoElement.addEventListener('canplay', handleCanPlay);
    
    if (videos.length > 1 || !loop) {
      videoElement.addEventListener('ended', handleEnded);
    }

    // Cleanup
    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoIndex, videos, loop, handleVideoEnd]);

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
      />
    </div>
  );
}