import React, { useState, useEffect, useRef } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);
  
  const videos = [
    '/videos/01.webm',
    '/videos/02.webm',
    '/videos/03.webm',
    '/videos/04.webm',
    '/videos/05.webm',
    '/videos/06.webm',
    '/videos/07.webm',
    '/videos/08.webm'
  ];

  useEffect(() => {
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    if (!video || !nextVideo) return;

    // Configura vídeo atual
    video.src = videos[currentVideoIndex];
    video.load();
    
    // Pré-carrega próximo vídeo
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    nextVideo.src = videos[nextIndex];
    nextVideo.load();
    
    // Configurações para melhor performance
    video.preload = 'auto';
    nextVideo.preload = 'metadata';
    
    // Função para tocar vídeo
    const playVideo = () => {
      // Força reinício do vídeo para evitar travamentos
      video.currentTime = 0;
      
      video.play().catch((error) => {
        console.warn('Erro ao reproduzir vídeo:', error);
        // Fallback: espera interação do usuário
        const handleInteraction = () => {
          video.play();
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('touchstart', handleInteraction);
        };
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
      });
    };
    
    // Aguarda o vídeo estar pronto
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true });
    }
    
  }, [currentVideoIndex, videos]);

  const handleVideoEnded = () => {
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    if (!video || !nextVideo) return;
    
    // Pausa vídeo atual para liberar recursos
    video.pause();
    
    // Troca imediata - sem animação complexa
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    
    // Mostra próximo vídeo
    nextVideo.style.display = 'block';
    nextVideo.currentTime = 0;
    nextVideo.play().catch(() => {
      // Se falhar, tenta novamente após delay
      setTimeout(() => nextVideo.play(), 100);
    });
    
    // Esconde vídeo atual
    video.style.display = 'none';
    
    // Atualiza estado
    setCurrentVideoIndex(nextIndex);
    
    // Restaura displays após transição
    setTimeout(() => {
      video.style.display = 'block';
      nextVideo.style.display = 'none';
    }, 200);
  };

  // Tratamento especial para vídeos problemáticos (01, 07, 08)
  const handleVideoError = () => {
    console.warn(`Erro no vídeo ${currentVideoIndex + 1}, pulando para o próximo`);
    // Pula automaticamente para próximo vídeo em caso de erro
    setTimeout(handleVideoEnded, 500);
  };

  const handleVideoStalled = () => {
    const video = videoRef.current;
    if (video) {
      console.warn(`Vídeo ${currentVideoIndex + 1} travou, reiniciando`);
      // Reinicia o vídeo se travar
      video.load();
      setTimeout(() => {
        video.play().catch(() => {
          // Se ainda assim falhar, pula para próximo
          handleVideoEnded();
        });
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        onStalled={handleVideoStalled}
        onWaiting={handleVideoStalled}
      />
      
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: 'none' }}
        muted
        playsInline
      />
    </div>
  );
}