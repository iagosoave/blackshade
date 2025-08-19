// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackgroundVideo from "../components/BackgroundVideo";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    // Estratégia de carregamento progressivo
    // Carrega apenas o primeiro vídeo inicialmente
    const firstVideo = '/videos/01.mp4';
    setVideos([firstVideo]);
    
    // Carrega os outros vídeos após um delay
    const loadRemainingVideos = setTimeout(() => {
      const remainingVideos = [
        '/videos/02.mp4',
        '/videos/03.mp4',
        '/videos/04.mp4',
        '/videos/05.mp4',
        '/videos/06.mp4',
        '/videos/07.mp4',
        '/videos/08.mp4'
      ];
      setVideos([firstVideo, ...remainingVideos]);
    }, 3000); // Aguarda 3 segundos antes de carregar os outros
    
    return () => clearTimeout(loadRemainingVideos);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
      {videos.length > 0 && (
        <BackgroundVideo 
          videos={videos} 
          opacity={1}
        />
      )}
    </motion.div>
  );
}