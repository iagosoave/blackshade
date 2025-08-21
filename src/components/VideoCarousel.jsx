import React, { useState, useEffect, useRef } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [debugInfo, setDebugInfo] = useState({});
  const [showDebug, setShowDebug] = useState(true); // Mostra debug por padrão
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

  // Função para atualizar debug info
  const updateDebug = (key, value) => {
    setDebugInfo(prev => ({
      ...prev,
      [key]: value,
      timestamp: new Date().toLocaleTimeString()
    }));
  };

  // Monitora eventos do vídeo
  const setupVideoEvents = (video, label) => {
    if (!video) return;

    const events = [
      'loadstart', 'durationchange', 'loadedmetadata', 'loadeddata',
      'progress', 'canplay', 'canplaythrough', 'play', 'playing',
      'pause', 'seeking', 'seeked', 'ended', 'error', 'stalled',
      'suspend', 'abort', 'emptied', 'waiting'
    ];

    events.forEach(eventType => {
      video.addEventListener(eventType, () => {
        updateDebug(`${label}_${eventType}`, true);
        console.log(`[${label}] ${eventType} - ReadyState: ${video.readyState}`);
        
        // Log específico para problemas
        if (eventType === 'stalled') {
          console.warn(`[${label}] TRAVOU! Buffered: ${video.buffered.length}, Current: ${video.currentTime}`);
        }
        if (eventType === 'error') {
          console.error(`[${label}] ERRO: ${video.error?.message}`);
        }
        if (eventType === 'waiting') {
          console.warn(`[${label}] AGUARDANDO dados...`);
        }
      });
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    if (!video || !nextVideo) return;

    // Setup debug para ambos os vídeos
    setupVideoEvents(video, 'MAIN');
    setupVideoEvents(nextVideo, 'NEXT');

    // Log do vídeo atual
    updateDebug('currentVideo', `${videos[currentVideoIndex]} (${currentVideoIndex + 1}/${videos.length})`);
    console.log(`🎬 Carregando vídeo ${currentVideoIndex + 1}: ${videos[currentVideoIndex]}`);

    // Configura vídeo atual
    video.src = videos[currentVideoIndex];
    video.load();
    
    // Configura próximo vídeo
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    nextVideo.src = videos[nextIndex];
    nextVideo.load();
    
    updateDebug('nextVideo', `${videos[nextIndex]} (${nextIndex + 1}/${videos.length})`);
    
    // Toca o vídeo atual
    const playVideo = () => {
      updateDebug('playAttempt', 'Tentando reproduzir...');
      video.play().catch((error) => {
        updateDebug('playError', error.message);
        console.error('❌ Erro ao reproduzir:', error);
        
        // Fallback para autoplay bloqueado
        document.addEventListener('click', () => {
          video.play();
          updateDebug('playAfterClick', 'Reproduzindo após clique');
        }, { once: true });
      });
    };
    
    // Inicia quando estiver pronto
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }
    
  }, [currentVideoIndex]);

  const handleVideoEnded = () => {
    console.log(`✅ Vídeo ${currentVideoIndex + 1} terminou`);
    updateDebug('videoEnded', `Vídeo ${currentVideoIndex + 1} terminou`);
    
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const video = videoRef.current;
    const nextVideo = nextVideoRef.current;
    
    // Transição
    nextVideo.style.display = 'block';
    nextVideo.play();
    video.style.display = 'none';
    
    // Atualiza estado
    setCurrentVideoIndex(nextIndex);
    
    // Reseta displays
    setTimeout(() => {
      video.style.display = 'block';
      nextVideo.style.display = 'none';
    }, 100);
  };

  // Monitora performance
  const getVideoStats = () => {
    const video = videoRef.current;
    if (!video) return {};
    
    return {
      readyState: video.readyState,
      networkState: video.networkState,
      currentTime: video.currentTime.toFixed(2),
      duration: video.duration?.toFixed(2) || 'N/A',
      buffered: video.buffered.length,
      paused: video.paused,
      ended: video.ended,
      error: video.error?.message || 'Nenhum'
    };
  };

  // Atualiza stats a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = getVideoStats();
      updateDebug('stats', stats);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={handleVideoEnded}
      />
      
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: 'none' }}
        muted
        playsInline
        preload="auto"
      />

      {/* PAINEL DE DEBUG */}
      {showDebug && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded text-xs max-w-md z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">🐛 DEBUG VÍDEOS</h3>
            <button 
              onClick={() => setShowDebug(false)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-1">
            <div><strong>Vídeo Atual:</strong> {debugInfo.currentVideo}</div>
            <div><strong>Próximo:</strong> {debugInfo.nextVideo}</div>
            <div><strong>Última Ação:</strong> {debugInfo.timestamp}</div>
            
            {debugInfo.stats && (
              <div className="mt-2 p-2 bg-gray-800 rounded">
                <div><strong>ReadyState:</strong> {debugInfo.stats.readyState}/4</div>
                <div><strong>NetworkState:</strong> {debugInfo.stats.networkState}</div>
                <div><strong>Tempo:</strong> {debugInfo.stats.currentTime}s / {debugInfo.stats.duration}s</div>
                <div><strong>Pausado:</strong> {debugInfo.stats.paused ? 'Sim' : 'Não'}</div>
                <div><strong>Buffer:</strong> {debugInfo.stats.buffered} segmentos</div>
                <div><strong>Erro:</strong> {debugInfo.stats.error}</div>
              </div>
            )}

            {debugInfo.playError && (
              <div className="mt-2 p-2 bg-red-900 rounded">
                <strong>❌ Erro:</strong> {debugInfo.playError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botão para mostrar debug se estiver oculto */}
      {!showDebug && (
        <button 
          onClick={() => setShowDebug(true)}
          className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm z-50"
        >
          Mostrar Debug
        </button>
      )}
    </div>
  );
}