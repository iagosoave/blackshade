// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BackgroundVideo from "../components/BackgroundVideo";

export default function HomePage() {
  const [videosReady, setVideosReady] = useState(false);
  
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

  // Forçar preload de TODOS os vídeos antes de mostrar
  useEffect(() => {
    let loadedCount = 0;
    const totalVideos = videos.length;
    
    // Criar promises para cada vídeo
    const preloadPromises = videos.map((videoUrl, index) => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.preload = 'auto';
        video.muted = true;
        
        // Adicionar ao DOM (invisível) para forçar download
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        video.style.width = '1px';
        video.style.height = '1px';
        document.body.appendChild(video);
        
        video.onloadeddata = () => {
          loadedCount++;
          console.log(`📹 Carregado: ${loadedCount}/${totalVideos}`);
          
          // Manter no DOM por um tempo para garantir cache
          setTimeout(() => {
            if (document.body.contains(video)) {
              document.body.removeChild(video);
            }
          }, 2000);
          
          resolve();
        };
        
        video.onerror = () => {
          console.error(`❌ Erro ao carregar vídeo ${index + 1}`);
          resolve(); // Resolve mesmo com erro para não travar
        };
        
        // Forçar o carregamento
        video.load();
      });
    });
    
    // Aguardar todos carregarem
    Promise.all(preloadPromises).then(() => {
      console.log('✅ Todos os vídeos pré-carregados!');
      setVideosReady(true);
    });
  }, []);

  // Mostrar loading enquanto carrega
  if (!videosReady) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-sm opacity-60">Carregando vídeos...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
      <BackgroundVideo 
        videos={videos} 
        opacity={1} 
        loop={true}
      />
    </motion.div>
  );
}