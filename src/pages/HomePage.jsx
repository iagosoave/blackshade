import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Vídeos (apenas MP4)
import backgroundVideo1 from "../01.mp4";
import backgroundVideo2 from "../02.mp4";

export default function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const videos = [backgroundVideo1, backgroundVideo2];

  // Troca para o próximo vídeo
  const goToNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  // Marca vídeo como pronto
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => setIsVideoReady(true);

    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("ended", goToNextVideo);

    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay);
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
        style={{ opacity: isVideoReady ? 1 : 0, transition: "opacity 0.5s" }}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      {/* Loading overlay até o vídeo ficar pronto */}
      {!isVideoReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-lg animate-pulse">Carregando...</div>
        </div>
      )}
    </motion.div>
  );
}
