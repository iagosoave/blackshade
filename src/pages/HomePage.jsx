import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Vídeos - importe apenas os que você realmente tem
import backgroundVideo1 from '../01.mp4';
import backgroundVideo2 from '../02.mp4';
import backgroundVideo3 from '../03.mp4';
import backgroundVideo4 from '../04.mp4';
import backgroundVideo5 from '../05.mp4';
import backgroundVideo6 from '../06.mp4';
import backgroundVideo7 from '../07.mp4';
import backgroundVideo8 from '../08.mp4';

export default function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
   
  // Array de vídeos
  const videos = [
    backgroundVideo1, 
    backgroundVideo2, 
    backgroundVideo3, 
    backgroundVideo4,
    backgroundVideo5,
    backgroundVideo6,
    backgroundVideo7,
    backgroundVideo8
  ];

  // Função para trocar para o próximo vídeo
  const goToNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  // Efeito para configurar o vídeo
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;

    // Configurações básicas do vídeo
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.preload = "auto";

    // Quando o vídeo terminar, vai para o próximo
    const handleVideoEnd = () => {
      goToNextVideo();
    };

    // Quando o vídeo estiver pronto para reproduzir
    const handleCanPlay = () => {
      setIsVideoReady(true);
      videoElement.play().catch(err => {
        console.log('Autoplay bloqueado, aguardando clique do usuário');
      });
    };

    // Adiciona os event listeners
    videoElement.addEventListener('ended', handleVideoEnd);
    videoElement.addEventListener('canplay', handleCanPlay);

    // Cleanup
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.removeEventListener('canplay', handleCanPlay);
      }
    };
  }, [currentVideoIndex]); // Recarrega quando muda o vídeo

  // Função para tentar reproduzir após clique do usuário
  const handleUserInteraction = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(err => {
        console.error('Erro ao reproduzir vídeo:', err);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
      onClick={handleUserInteraction} // Tenta reproduzir ao clicar
    >
      {/* Vídeo de Background */}
      <video
        ref={videoRef}
        key={`video-${currentVideoIndex}`} // Força remount ao trocar vídeo
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        style={{ opacity: isVideoReady ? 1 : 0 }}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      {/* Loading indicator enquanto o vídeo carrega */}
      {!isVideoReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-lg animate-pulse">Carregando...</div>
        </div>
      )}
    </motion.div>
  );
}