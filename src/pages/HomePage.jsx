import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useContentful from '../hocks/useContentful';

// Vídeos
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
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  
  // Inicializa o array de refs para todos os vídeos
  const videoRefs = useRef([]);
   
  // Array de vídeos expandido para 8 vídeos
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
   
  // Dados do Contentful (se necessário)
  const { data: homepageData } = useContentful('homepage');

  // Função para avançar para o próximo vídeo
  const goToNextVideo = useCallback(() => {
    // Troca instantânea sem delay
    setCurrentVideoIndex(nextVideoIndex);
    setNextVideoIndex((nextVideoIndex + 1) % videos.length);
  }, [nextVideoIndex, videos.length]);

  // Efeito para configurar os vídeos
  useEffect(() => {
    videos.forEach((_, index) => {
      const videoElement = videoRefs.current[index];
      
      if (videoElement) {
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.loop = false;
        
        // Pré-carrega apenas o vídeo atual e o próximo
        if (index === currentVideoIndex || index === nextVideoIndex) {
          videoElement.preload = "auto";
        }
      }
    });
  }, [currentVideoIndex, nextVideoIndex, videos]);

  // Efeito para reproduzir o vídeo atual e preparar o próximo
  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    const nextVideo = videoRefs.current[nextVideoIndex];
    
    if (currentVideo) {
      const playCurrentVideo = () => {
        currentVideo.play().catch(err => {
          console.warn('Erro ao tentar reproduzir o vídeo automaticamente:', err);
          document.addEventListener('click', () => {
            currentVideo.play().catch(e => console.error('Erro ao reproduzir vídeo após clique:', e));
          }, { once: true });
        });
      };

      const handleVideoEnd = () => {
        // Inicia o próximo vídeo imediatamente antes da troca
        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(err => console.error('Erro ao iniciar próximo vídeo:', err));
        }
        
        // Troca instantânea
        goToNextVideo();
      };

      // Adiciona listener para o fim do vídeo
      currentVideo.addEventListener('ended', handleVideoEnd);

      // Inicia o vídeo atual
      if (currentVideo.readyState >= 3) {
        playCurrentVideo();
      } else {
        currentVideo.addEventListener('loadeddata', playCurrentVideo);
      }

      // Prepara o próximo vídeo
      if (nextVideo) {
        nextVideo.currentTime = 0;
        // Pré-carrega o próximo vídeo
        if (nextVideo.readyState < 3) {
          nextVideo.load();
        }
      }

      return () => {
        currentVideo.removeEventListener('ended', handleVideoEnd);
        currentVideo.removeEventListener('loadeddata', playCurrentVideo);
      };
    }
  }, [currentVideoIndex, nextVideoIndex, goToNextVideo]);

  // Listener para detectar quando o próximo vídeo está quase pronto
  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    const nextVideo = videoRefs.current[nextVideoIndex];
    
    if (currentVideo && nextVideo) {
      const checkTimeUpdate = () => {
        // Quando faltarem 0.5 segundos para o fim, prepara o próximo vídeo
        if (currentVideo.duration - currentVideo.currentTime <= 0.5) {
          nextVideo.currentTime = 0;
          // Garante que o próximo vídeo está carregado
          if (nextVideo.readyState < 3) {
            nextVideo.load();
          }
        }
      };
      
      currentVideo.addEventListener('timeupdate', checkTimeUpdate);
      
      return () => {
        currentVideo.removeEventListener('timeupdate', checkTimeUpdate);
      };
    }
  }, [currentVideoIndex, nextVideoIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
      {/* Vídeos de Background - Sem transição, troca direta */}
      <div className="absolute inset-0 w-full h-full">
        {videos.map((video, index) => {
          const isCurrentVideo = index === currentVideoIndex;
          const isNextVideo = index === nextVideoIndex;
          
          return (
            <video
              key={`video-${index}`}
              ref={el => videoRefs.current[index] = el}
              autoPlay={false}
              muted={true}
              playsInline={true}
              controls={false}
              preload={isCurrentVideo || isNextVideo ? "auto" : "none"}
              className="absolute"
              style={{ 
                pointerEvents: 'none',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1.1)',
                minWidth: '100vw',
                minHeight: '100vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'cover',
                // Vídeo atual sempre visível, próximo fica por baixo pronto
                zIndex: isCurrentVideo ? 10 : isNextVideo ? 5 : 1,
                display: isCurrentVideo || isNextVideo ? 'block' : 'none'
              }}
            >
              <source src={video} type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          );
        })}
      </div>
    </motion.div>
  );
}