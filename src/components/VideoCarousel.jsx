import React, { useState, useEffect, useRef } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const bufferCheckRef = useRef(null);
  
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

  // Função para verificar se há buffer suficiente
  const hasEnoughBuffer = (video) => {
    if (!video || !video.buffered.length) return false;
    
    const currentTime = video.currentTime;
    const buffered = video.buffered;
    
    // Verifica se há pelo menos 3 segundos de buffer à frente
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime + 3) {
        return true;
      }
    }
    return false;
  };

  // Função para aguardar buffer adequado antes de reproduzir
  const waitForBuffer = (video) => {
    return new Promise((resolve) => {
      const checkBuffer = () => {
        if (video.readyState >= 3 && hasEnoughBuffer(video)) {
          resolve();
        } else if (video.readyState === 4) {
          // Se ReadyState é 4, pode reproduzir mesmo com buffer baixo
          resolve();
        } else {
          // Aguarda mais dados
          setTimeout(checkBuffer, 100);
        }
      };
      
      // Timeout de segurança - máximo 5 segundos esperando
      setTimeout(() => {
        console.warn('Timeout de buffer - reproduzindo mesmo assim');
        resolve();
      }, 5000);
      
      checkBuffer();
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    if (!video || !nextVideo) return;

    // Configura vídeo atual com preload agressivo
    video.src = videos[currentVideoIndex];
    video.preload = 'auto';
    video.load();
    
    // Configura próximo vídeo
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    nextVideo.src = videos[nextIndex];
    nextVideo.preload = 'metadata';
    nextVideo.load();
    
    // Função de reprodução com espera de buffer
    const playVideo = async () => {
      try {
        // Aguarda buffer adequado
        await waitForBuffer(video);
        
        // Reproduz o vídeo
        await video.play();
        
        // Inicia monitoramento de buffer durante reprodução
        startBufferMonitoring(video);
        
      } catch (error) {
        console.warn('Erro ao reproduzir:', error);
        
        // Fallback para autoplay bloqueado
        const handleInteraction = async () => {
          await waitForBuffer(video);
          video.play();
          startBufferMonitoring(video);
        };
        
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
      }
    };
    
    playVideo();
    
  }, [currentVideoIndex]);

  // Monitora buffer durante reprodução para evitar travamentos
  const startBufferMonitoring = (video) => {
    if (bufferCheckRef.current) {
      clearInterval(bufferCheckRef.current);
    }
    
    bufferCheckRef.current = setInterval(() => {
      if (video.paused || video.ended) {
        clearInterval(bufferCheckRef.current);
        return;
      }
      
      // Se não há buffer suficiente, pausa momentaneamente
      if (!hasEnoughBuffer(video) && video.readyState < 3) {
        console.log('Buffer baixo - pausando para carregar');
        video.pause();
        
        // Aguarda buffer e retoma
        waitForBuffer(video).then(() => {
          if (!video.ended) {
            video.play();
          }
        });
      }
    }, 1000);
  };

  const handleVideoEnded = () => {
    // Limpa monitoramento
    if (bufferCheckRef.current) {
      clearInterval(bufferCheckRef.current);
    }
    
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    // Transição rápida
    nextVideo.style.display = 'block';
    nextVideo.currentTime = 0;
    
    // Aguarda buffer do próximo vídeo antes de trocar
    waitForBuffer(nextVideo).then(() => {
      nextVideo.play();
      video.style.display = 'none';
      
      // Atualiza índice
      setCurrentVideoIndex(nextIndex);
      
      // Restaura displays
      setTimeout(() => {
        video.style.display = 'block';
        nextVideo.style.display = 'none';
      }, 200);
    });
  };

  // Handler para vídeos que ficam aguardando dados
  const handleVideoWaiting = (video) => {
    console.log('Vídeo aguardando dados - tentando recuperar');
    
    // Estratégia: pula alguns segundos à frente se travar
    setTimeout(() => {
      if (video.readyState < 3) {
        video.currentTime = Math.min(video.currentTime + 2, video.duration - 1);
      }
    }, 2000);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (bufferCheckRef.current) {
        clearInterval(bufferCheckRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        onEnded={handleVideoEnded}
        onWaiting={() => handleVideoWaiting(videoRef.current)}
        onStalled={() => handleVideoWaiting(videoRef.current)}
        onError={(e) => {
          console.error('Erro no vídeo:', e);
          // Em caso de erro, pula para próximo
          setTimeout(handleVideoEnded, 1000);
        }}
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