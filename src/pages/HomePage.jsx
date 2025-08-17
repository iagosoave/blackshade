import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Vídeos (apenas MP4)
import backgroundVideo1 from "../01.mp4";
import backgroundVideo2 from "../02.mp4";

export default function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  
  const videos = [backgroundVideo1, backgroundVideo2];

  // Pré-carrega todos os vídeos na inicialização
  useEffect(() => {
    // Cria elementos de vídeo para cada URL
    videoRefs.current = videos.map((videoSrc, index) => {
      const video = document.createElement('video');
      video.src = videoSrc;
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      video.loop = false;
      
      // Pré-carrega o vídeo
      video.load();
      
      // Se for o primeiro vídeo, prepara para tocar
      if (index === 0) {
        video.autoplay = true;
        video.play().catch(e => console.log('Autoplay prevented:', e));
      }
      
      return video;
    });

    // Cleanup
    return () => {
      videoRefs.current.forEach(video => {
        video.pause();
        video.src = '';
        video.load();
      });
    };
  }, []);

  // Gerencia a troca de vídeos
  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (!currentVideo) return;

    const handleEnded = () => {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      const nextVideo = videoRefs.current[nextIndex];
      
      // Prepara o próximo vídeo
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(e => console.log('Play prevented:', e));
      }
      
      setCurrentVideoIndex(nextIndex);
    };

    currentVideo.addEventListener('ended', handleEnded);
    
    // Garante que o vídeo atual está tocando
    if (currentVideo.paused) {
      currentVideo.play().catch(e => console.log('Play prevented:', e));
    }

    return () => {
      currentVideo.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoIndex, videos.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black"
      ref={containerRef}
    >
      {/* Renderiza todos os vídeos, mas só mostra o atual */}
      {videos.map((videoSrc, index) => (
        <motion.video
          key={`video-${index}`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentVideoIndex ? 1 : 0,
            scale: index === currentVideoIndex ? 1 : 1.05
          }}
          transition={{ 
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
          className="absolute inset-0 w-full h-full object-cover"
          ref={el => {
            if (el && !videoRefs.current[index]) {
              videoRefs.current[index] = el;
            }
          }}
          autoPlay={index === 0}
          muted
          playsInline
          preload="auto"
          style={{ 
            zIndex: index === currentVideoIndex ? 1 : 0,
            pointerEvents: 'none'
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </motion.video>
      ))}
    </motion.div>
  );
}