// components/BackgroundVideo.jsx - VERSÃO AVANÇADA
import React, { useState, useRef, useEffect } from 'react';

/**
 * BackgroundVideo Avançado - Double Buffer para transições instantâneas
 * Mantém 2 elementos de vídeo e alterna entre eles
 */
export default function BackgroundVideo({ videos, opacity = 1, loop = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState(1);
  
  // Dois players de vídeo
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  
  // Estado de carregamento
  const [isReady, setIsReady] = useState(false);

  // Inicialização
  useEffect(() => {
    if (!video1Ref.current || !video2Ref.current) return;

    const setupVideo = (video) => {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('webkit-playsinline', 'true');
      video.preload = 'auto';
      video.style.position = 'absolute';
      video.style.top = '0';
      video.style.left = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
    };

    setupVideo(video1Ref.current);
    setupVideo(video2Ref.current);

    // Carregar primeiro vídeo
    video1Ref.current.src = videos[0];
    
    // Pré-carregar segundo vídeo se existir
    if (videos.length > 1) {
      video2Ref.current.src = videos[1];
      video2Ref.current.load();
    }

    // Iniciar reprodução quando pronto
    video1Ref.current.addEventListener('canplaythrough', () => {
      video1Ref.current.play().catch(console.log);
      setIsReady(true);
    }, { once: true });

    video1Ref.current.load();
  }, [videos]);

  // Gerenciar transições
  useEffect(() => {
    if (!isReady) return;

    const currentVideo = activePlayer === 1 ? video1Ref.current : video2Ref.current;
    const nextVideo = activePlayer === 1 ? video2Ref.current : video1Ref.current;

    if (!currentVideo || !nextVideo) return;

    const handleVideoEnd = () => {
      if (!loop && currentIndex === videos.length - 1) return;

      const nextIndex = (currentIndex + 1) % videos.length;
      
      // Preparar próximo vídeo
      nextVideo.src = videos[nextIndex];
      
      // Quando próximo vídeo estiver pronto, trocar
      nextVideo.addEventListener('canplay', () => {
        // Trocar vídeos instantaneamente
        currentVideo.style.display = 'none';
        nextVideo.style.display = 'block';
        nextVideo.play().catch(console.log);
        
        // Atualizar estados
        setActivePlayer(activePlayer === 1 ? 2 : 1);
        setCurrentIndex(nextIndex);
        
        // Resetar vídeo anterior
        currentVideo.currentTime = 0;
        
        // Pré-carregar próximo
        if (videos.length > 2) {
          const futureIndex = (nextIndex + 1) % videos.length;
          setTimeout(() => {
            currentVideo.src = videos[futureIndex];
            currentVideo.load();
          }, 100);
        }
      }, { once: true });

      nextVideo.load();
    };

    // Se apenas um vídeo e loop ativado
    if (videos.length === 1 && loop) {
      currentVideo.loop = true;
    } else {
      currentVideo.addEventListener('ended', handleVideoEnd);
      
      return () => {
        currentVideo.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [activePlayer, currentIndex, videos, loop, isReady]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <video
        ref={video1Ref}
        style={{
          display: activePlayer === 1 ? 'block' : 'none',
          opacity,
          pointerEvents: 'none'
        }}
        muted
        playsInline
      />
      <video
        ref={video2Ref}
        style={{
          display: activePlayer === 2 ? 'block' : 'none',
          opacity,
          pointerEvents: 'none'
        }}
        muted
        playsInline
      />
      
      {/* Indicador de carregamento */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}