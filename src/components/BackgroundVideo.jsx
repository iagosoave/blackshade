// src/components/BackgroundVideo.jsx - VERSÃO ULTRA OTIMIZADA
import React, { useState, useRef, useEffect } from 'react';

export default function BackgroundVideo({ videos, opacity = 1, loop = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState('A');
  
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const preloadedUrls = useRef(new Set());

  // Preload AGRESSIVO de todos os vídeos na inicialização
  useEffect(() => {
    // Preload todos os vídeos imediatamente
    videos.forEach((videoUrl, index) => {
      if (!preloadedUrls.current.has(videoUrl)) {
        // Criar elemento video oculto para forçar cache
        const preloader = document.createElement('video');
        preloader.src = videoUrl;
        preloader.preload = 'auto';
        preloader.muted = true;
        preloader.style.display = 'none';
        preloader.load();
        
        // Adicionar ao DOM temporariamente para garantir cache
        document.body.appendChild(preloader);
        
        preloader.onloadeddata = () => {
          preloadedUrls.current.add(videoUrl);
          console.log(`✅ Vídeo ${index + 1} pré-carregado`);
          // Remover após carregar
          setTimeout(() => {
            if (document.body.contains(preloader)) {
              document.body.removeChild(preloader);
            }
          }, 1000);
        };
      }
    });
  }, [videos]);

  // Configuração inicial dos dois players
  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    
    if (!videoA || !videoB) return;

    // Configurar ambos os vídeos
    [videoA, videoB].forEach(video => {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('webkit-playsinline', 'true');
      video.preload = 'auto';
      video.disablePictureInPicture = true;
    });

    // Carregar primeiro vídeo no player A
    videoA.src = videos[0];
    videoA.style.display = 'block';
    videoB.style.display = 'none';
    
    // Carregar segundo vídeo no player B (se existir)
    if (videos.length > 1) {
      videoB.src = videos[1];
      videoB.load(); // Força o preload
    }

    // Iniciar reprodução
    videoA.play().catch(err => {
      console.log('Autoplay bloqueado, aguardando interação');
      const handleClick = () => {
        videoA.play();
        document.removeEventListener('click', handleClick);
      };
      document.addEventListener('click', handleClick, { once: true });
    });

  }, []); // Executar apenas uma vez

  // Gerenciar transições entre vídeos
  useEffect(() => {
    const currentVideo = activePlayer === 'A' ? videoARef.current : videoBRef.current;
    const nextVideo = activePlayer === 'A' ? videoBRef.current : videoARef.current;
    
    if (!currentVideo || !nextVideo) return;

    const handleVideoEnd = () => {
      if (!loop && currentIndex === videos.length - 1) return;

      const nextIndex = (currentIndex + 1) % videos.length;
      const futureIndex = (nextIndex + 1) % videos.length;

      // TRANSIÇÃO INSTANTÂNEA
      // 1. Iniciar próximo vídeo imediatamente
      nextVideo.currentTime = 0;
      nextVideo.play().catch(console.error);
      
      // 2. Trocar displays instantaneamente
      currentVideo.style.display = 'none';
      nextVideo.style.display = 'block';
      
      // 3. Pausar e resetar vídeo anterior
      currentVideo.pause();
      currentVideo.currentTime = 0;
      
      // 4. Pré-carregar o próximo vídeo no player que acabou de ser liberado
      setTimeout(() => {
        if (videos[futureIndex]) {
          currentVideo.src = videos[futureIndex];
          currentVideo.load();
        }
      }, 50); // Pequeno delay para não interferir na transição
      
      // Atualizar estados
      setActivePlayer(activePlayer === 'A' ? 'B' : 'A');
      setCurrentIndex(nextIndex);
    };

    // Event listener para o fim do vídeo
    currentVideo.addEventListener('ended', handleVideoEnd);
    
    // Para vídeo único com loop
    if (videos.length === 1 && loop) {
      currentVideo.loop = true;
    }

    return () => {
      currentVideo.removeEventListener('ended', handleVideoEnd);
    };
  }, [activePlayer, currentIndex, videos, loop]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* Player A */}
      <video
        ref={videoARef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity,
          pointerEvents: 'none',
          display: 'block', // Será controlado via JS
          transition: 'none' // IMPORTANTE: sem transições CSS
        }}
        muted
        playsInline
        autoPlay
      />
      
      {/* Player B */}
      <video
        ref={videoBRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity,
          pointerEvents: 'none',
          display: 'none', // Será controlado via JS
          transition: 'none' // IMPORTANTE: sem transições CSS
        }}
        muted
        playsInline
      />
    </div>
  );
}