import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Vídeos (apenas MP4)
import backgroundVideo1 from "../01.mp4";
import backgroundVideo2 from "../02.mp4";

export default function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const videos = [backgroundVideo1, backgroundVideo2];

  // Troca para o próximo vídeo
  const goToNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  // Pré-carrega todos os vídeos na inicialização
  useEffect(() => {
    // Pré-carrega todos os vídeos
    videos.forEach(videoSrc => {
      const video = document.createElement('video');
      video.src = videoSrc;
      video.preload = 'auto';
      video.load();
    });
  }, []);

  // Adiciona listener para o fim do vídeo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.addEventListener("ended", goToNextVideo);

    return () => {
      videoElement.removeEventListener("ended", goToNextVideo);
    };
  }, [currentVideoIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
      {/* Vídeo de Background */}
      <video
        ref={videoRef}
        key={`video-${currentVideoIndex}`}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>
    </motion.div>
  );
}